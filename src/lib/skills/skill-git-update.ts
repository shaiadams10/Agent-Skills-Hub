import "server-only";
import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import type { InstalledSkill } from "@/lib/scanner/skill-scanner";
import type { SkillGitUpdateStatus } from "@/lib/skills/skill-update-types";
import {
  cacheEntryIsFresh,
  loadUpdateCheckCache,
  readCacheEntry,
  saveUpdateCheckCache,
  writeCacheEntry,
  type CachedGitEntry,
} from "@/lib/skills/update-check-cache";

const execFileAsync = promisify(execFile);

async function git(
  skillPath: string,
  args: string[],
  timeout = 12_000,
): Promise<string> {
  const { stdout } = await execFileAsync("git", ["-C", skillPath, ...args], {
    timeout,
    windowsHide: true,
    maxBuffer: 1024 * 1024,
    encoding: "utf-8",
  });
  return stdout;
}

async function hasGitFolder(skillPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.join(skillPath, ".git"));
    return stat.isDirectory() || stat.isFile();
  } catch {
    return false;
  }
}

function entryToStatus(entry: CachedGitEntry): SkillGitUpdateStatus {
  if (entry.behind) {
    return {
      state: "update_available",
      localSha: entry.localSha,
      remoteSha: entry.remoteSha,
      branch: entry.branch,
      checkedAt: entry.checkedAt,
    };
  }
  return {
    state: "up_to_date",
    localSha: entry.localSha,
    remoteSha: entry.remoteSha,
    branch: entry.branch,
    checkedAt: entry.checkedAt,
  };
}

export async function checkSkillGitUpdateCached(
  skillPath: string,
  options: { force?: boolean },
): Promise<SkillGitUpdateStatus> {
  const resolved = path.resolve(skillPath);
  if (!(await hasGitFolder(resolved))) {
    return { state: "not_git" };
  }

  const cache = await loadUpdateCheckCache();
  const cached = readCacheEntry(cache, resolved);

  if (cached && !options.force && cacheEntryIsFresh(cached)) {
    try {
      const head = (await git(resolved, ["rev-parse", "HEAD"])).trim();
      if (head === cached.localSha) {
        return entryToStatus(cached);
      }
    } catch {
      /* re-run full check */
    }
  }

  const checkedAt = new Date().toISOString();

  try {
    const remotes = await git(resolved, ["remote"]);
    const remoteNames = remotes
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter(Boolean);
    if (!remoteNames.includes("origin")) {
      return {
        state: "git_error",
        message: "Git repo has no origin remote — cannot check for updates.",
        checkedAt,
      };
    }

    const localSha = (await git(resolved, ["rev-parse", "HEAD"])).trim();
    const branch = (
      await git(resolved, ["rev-parse", "--abbrev-ref", "HEAD"])
    ).trim();

    if (branch === "HEAD") {
      return {
        state: "git_error",
        message: "Detached HEAD — check out a branch to compare with origin.",
        checkedAt,
      };
    }

    let remoteLine = (
      await git(resolved, ["ls-remote", "--heads", "origin", branch])
    ).trim();

    let remoteSha = remoteLine.split(/\s+/)[0] ?? "";

    if (!remoteSha) {
      remoteLine = (await git(resolved, ["ls-remote", "origin", "HEAD"])).trim();
      const match = remoteLine.split(/\r?\n/).find((l) => l.includes("\t"));
      remoteSha = match?.split(/\t/)[0]?.trim() ?? "";
    }

    if (!remoteSha) {
      return {
        state: "git_error",
        message: "Could not read origin (network or empty remote).",
        checkedAt,
      };
    }

    const behind = localSha !== remoteSha;
    const entry: CachedGitEntry = {
      localSha,
      remoteSha,
      branch,
      behind,
      checkedAt,
    };
    writeCacheEntry(cache, resolved, entry);
    await saveUpdateCheckCache(cache);

    return entryToStatus(entry);
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : "Git check failed (is git installed and on PATH?)";
    return { state: "git_error", message, checkedAt };
  }
}

async function runPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;

  async function worker() {
    for (;;) {
      const idx = i++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx]!);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

export async function attachGitUpdateStatusToSkills(
  skills: InstalledSkill[],
  options: { force?: boolean },
): Promise<InstalledSkill[]> {
  if (skills.length === 0) return skills;

  const statuses = await runPool(skills, 4, (s) =>
    checkSkillGitUpdateCached(s.skillPath, options),
  );

  return skills.map((s, idx) => ({
    ...s,
    gitUpdateStatus: statuses[idx],
  }));
}

export type UpdateCheckSummary = {
  checkedAt: string;
  gitSkillFolders: number;
  updateAvailableCount: number;
  errorsCount: number;
  cacheTtlHours: number;
  forced: boolean;
  /** True when client passed checkUpdates=0 */
  skipped?: boolean;
};

export async function enrichScanWithGitUpdates<
  T extends {
    global: InstalledSkill[];
    projects: { path: string; label: string; skills: InstalledSkill[] }[];
  },
>(
  scan: T,
  options: { force?: boolean },
): Promise<
  T & {
    updateCheckSummary: UpdateCheckSummary;
  }
> {
  const allSkills = [
    ...scan.global,
    ...scan.projects.flatMap((p) => p.skills),
  ];

  const withUpdates = await attachGitUpdateStatusToSkills(allSkills, options);

  const byId = new Map(withUpdates.map((s) => [s.id, s]));

  const global = scan.global.map((s) => byId.get(s.id) ?? s);
  const projects = scan.projects.map((p) => ({
    ...p,
    skills: p.skills.map((s) => byId.get(s.id) ?? s),
  }));

  const updateAvailableCount = withUpdates.filter(
    (s) => s.gitUpdateStatus?.state === "update_available",
  ).length;
  const errorsCount = withUpdates.filter(
    (s) => s.gitUpdateStatus?.state === "git_error",
  ).length;
  const gitSkillFolders = withUpdates.filter(
    (s) =>
      !!s.gitUpdateStatus &&
      s.gitUpdateStatus.state !== "not_git" &&
      s.gitUpdateStatus.state !== "skipped",
  ).length;

  return {
    ...scan,
    global,
    projects,
    updateCheckSummary: {
      checkedAt: new Date().toISOString(),
      gitSkillFolders,
      updateAvailableCount,
      errorsCount,
      cacheTtlHours: 4,
      forced: Boolean(options.force),
    },
  };
}

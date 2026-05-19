import "server-only";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { getMergedSkillPaths } from "@/lib/agents/merged-paths";
import { parseSkillMd, type ParsedSkill } from "@/lib/scanner/parse-skill";
import type { InstallOrigin } from "@/lib/skills/install-origin";
import { resolveInstallOrigin } from "@/lib/skills/install-origin";

import type { SkillGitUpdateStatus } from "@/lib/skills/skill-update-types";

export type InstalledSkill = {
  id: string;
  compatibleAgentIds: string[];
  scope: "project" | "global";
  skillDirName: string;
  skillPath: string;
  skillMdPath: string;
  skillsRoot: string;
  skillsRootRelative: string;
  rootLabel: string;
  rootPath: string;
  parsed: ParsedSkill;
  installOrigin: InstallOrigin;
  gitUpdateStatus?: SkillGitUpdateStatus;
};

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".venv",
  "venv",
  "__pycache__",
  "dist",
  "build",
  ".next",
  "coverage",
  ".turbo",
  "vendor",
  "scripts",
  "references",
  "assets",
]);

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function buildInstalledSkill(
  skillMdPath: string,
  skillDirName: string,
  ctx: {
    compatibleAgentIds: string[];
    scope: "project" | "global";
    rootPath: string;
    rootLabel: string;
    skillsRoot: string;
    skillsRootRelative: string;
  },
): Promise<InstalledSkill> {
  const content = await fs.readFile(skillMdPath, "utf-8");
  const parsed = parseSkillMd(content, skillDirName);
  const skillFolder = path.dirname(skillMdPath);
  const compatibleAgentIds = ctx.compatibleAgentIds;

  return {
    id: `${ctx.scope}:${skillMdPath}`,
    compatibleAgentIds,
    scope: ctx.scope,
    skillDirName,
    skillPath: skillFolder,
    skillMdPath,
    skillsRoot: ctx.skillsRoot,
    skillsRootRelative: ctx.skillsRootRelative,
    rootLabel: ctx.rootLabel,
    rootPath: ctx.rootPath,
    parsed,
    installOrigin: resolveInstallOrigin({
      skillPath: skillFolder,
      skillDirName,
      skillsRootRelative: ctx.skillsRootRelative,
      scope: ctx.scope,
      compatibleAgentIds,
      parsed,
    }),
  };
}

/** Find all SKILL.md under skillsRoot (flat or recursive per docs). */
async function collectSkillsInRoot(
  skillsRoot: string,
  recursive: boolean,
  ctx: Omit<
    Parameters<typeof buildInstalledSkill>[2],
    "skillsRoot" | "skillsRootRelative"
  > & { skillsRootRelative: string },
): Promise<InstalledSkill[]> {
  if (!(await pathExists(skillsRoot))) return [];

  const results: InstalledSkill[] = [];

  async function visit(dir: string, depth: number): Promise<void> {
    if (depth > 12) return;

    const skillMd = path.join(dir, "SKILL.md");
    if (await pathExists(skillMd)) {
      const dirName = path.basename(dir);
      if (dirName !== "skills" && !dirName.startsWith(".")) {
        results.push(
          await buildInstalledSkill(skillMd, dirName, {
            ...ctx,
            skillsRoot,
            skillsRootRelative: ctx.skillsRootRelative,
          }),
        );
      }
      if (!recursive) return;
    }

    if (!recursive) {
      const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith(".")) continue;
        if (SKIP_DIR_NAMES.has(entry.name)) continue;
        const sub = path.join(dir, entry.name);
        const subMd = path.join(sub, "SKILL.md");
        if (await pathExists(subMd)) {
          results.push(
            await buildInstalledSkill(subMd, entry.name, {
              ...ctx,
              skillsRoot,
              skillsRootRelative: ctx.skillsRootRelative,
            }),
          );
        }
      }
      return;
    }

    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      const sub = path.join(dir, entry.name);
      await visit(sub, depth + 1);
    }
  }

  await visit(skillsRoot, 0);
  return results;
}

async function scanMergedPath(
  basePath: string,
  merged: {
    relativePath: string;
    agentIds: string[];
    recursive: boolean;
  },
  scope: "project" | "global",
  rootPath: string,
  rootLabel: string,
): Promise<InstalledSkill[]> {
  const skillsRoot = path.join(basePath, merged.relativePath);
  return collectSkillsInRoot(skillsRoot, merged.recursive, {
    compatibleAgentIds: merged.agentIds,
    scope,
    rootPath,
    rootLabel,
    skillsRootRelative: merged.relativePath,
  });
}

export async function scanGlobalSkills(): Promise<InstalledSkill[]> {
  const home = os.homedir();
  const paths = getMergedSkillPaths("global");
  const all: InstalledSkill[] = [];

  for (const merged of paths) {
    all.push(
      ...(await scanMergedPath(
        home,
        merged,
        "global",
        home,
        "This computer (all projects)",
      )),
    );
  }

  return dedupeByPath(all);
}

export async function scanProjectSkills(
  projectPath: string,
  projectLabel?: string,
): Promise<InstalledSkill[]> {
  const normalized = path.resolve(projectPath);
  if (!(await pathExists(normalized))) return [];

  const label = projectLabel ?? path.basename(normalized);
  const paths = getMergedSkillPaths("project");
  const all: InstalledSkill[] = [];

  for (const merged of paths) {
    all.push(
      ...(await scanMergedPath(
        normalized,
        merged,
        "project",
        normalized,
        label,
      )),
    );
  }

  return dedupeByPath(all);
}

function dedupeByPath(skills: InstalledSkill[]): InstalledSkill[] {
  const map = new Map<string, InstalledSkill>();

  for (const s of skills) {
    const key = s.skillMdPath.toLowerCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...s, compatibleAgentIds: [...s.compatibleAgentIds] });
    } else {
      const ids = new Set([
        ...existing.compatibleAgentIds,
        ...s.compatibleAgentIds,
      ]);
      existing.compatibleAgentIds = [...ids];
    }
  }

  return [...map.values()].map((s) => {
    const compatibleAgentIds = [...new Set(s.compatibleAgentIds)].sort();
    return {
      ...s,
      compatibleAgentIds,
      installOrigin: resolveInstallOrigin({
        skillPath: s.skillPath,
        skillDirName: s.skillDirName,
        skillsRootRelative: s.skillsRootRelative,
        scope: s.scope,
        compatibleAgentIds,
        parsed: s.parsed,
      }),
    };
  });
}

export async function scanAll(
  projectPaths: { path: string; label?: string }[],
): Promise<{
  global: InstalledSkill[];
  projects: { path: string; label: string; skills: InstalledSkill[] }[];
  scannedRoots: {
    scope: string;
    relativePath: string;
    agentIds: string[];
  }[];
}> {
  const global = await scanGlobalSkills();
  const projects: { path: string; label: string; skills: InstalledSkill[] }[] =
    [];

  for (const proj of projectPaths) {
    const skills = await scanProjectSkills(proj.path, proj.label);
    projects.push({
      path: path.resolve(proj.path),
      label: proj.label ?? path.basename(proj.path),
      skills,
    });
  }

  return {
    global,
    projects,
    scannedRoots: [
      ...getMergedSkillPaths("global").map((r) => ({
        scope: "global",
        relativePath: r.relativePath,
        agentIds: r.agentIds,
      })),
      ...getMergedSkillPaths("project").map((r) => ({
        scope: "project",
        relativePath: r.relativePath,
        agentIds: r.agentIds,
      })),
    ],
  };
}

import "server-only";
import fs from "fs/promises";
import path from "path";
import os from "os";

export type CachedGitEntry = {
  localSha: string;
  remoteSha: string;
  branch: string;
  behind: boolean;
  checkedAt: string;
};

type CacheFile = {
  version: 1;
  entries: Record<string, CachedGitEntry>;
};

const TTL_MS = 4 * 60 * 60 * 1000;

function cacheFilePath(): string {
  return path.join(os.homedir(), ".agent-skills-hub", "update-check-cache.json");
}

export function normalizeSkillPathKey(skillPath: string): string {
  return path.resolve(skillPath).toLowerCase();
}

export async function loadUpdateCheckCache(): Promise<CacheFile> {
  try {
    const raw = await fs.readFile(cacheFilePath(), "utf-8");
    const parsed = JSON.parse(raw) as CacheFile;
    if (parsed?.version !== 1 || typeof parsed.entries !== "object") {
      return { version: 1, entries: {} };
    }
    return parsed;
  } catch {
    return { version: 1, entries: {} };
  }
}

export async function saveUpdateCheckCache(cache: CacheFile): Promise<void> {
  const dir = path.dirname(cacheFilePath());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(cacheFilePath(), JSON.stringify(cache, null, 2), "utf-8");
}

export function readCacheEntry(
  cache: CacheFile,
  skillPath: string,
): CachedGitEntry | undefined {
  return cache.entries[normalizeSkillPathKey(skillPath)];
}

export function cacheEntryIsFresh(
  entry: CachedGitEntry,
  now = Date.now(),
): boolean {
  const t = new Date(entry.checkedAt).getTime();
  return now - t < TTL_MS;
}

export function writeCacheEntry(
  cache: CacheFile,
  skillPath: string,
  entry: CachedGitEntry,
): void {
  cache.entries[normalizeSkillPathKey(skillPath)] = entry;
}

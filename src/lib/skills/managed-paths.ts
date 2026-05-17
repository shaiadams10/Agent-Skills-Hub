import "server-only";
import path from "path";
import os from "os";
import { CANONICAL_SKILL_PATHS } from "@/lib/agents/skill-paths";
import { loadSettings } from "@/lib/settings/store";

export function isUnder(parent: string, child: string): boolean {
  const p = path.resolve(parent);
  const c = path.resolve(child);
  if (p === c) return true;
  return c.toLowerCase().startsWith(p.toLowerCase() + path.sep);
}

/** Allowed skill directory roots (parent folders that contain skill subfolders). */
export async function getAllowedSkillRoots(): Promise<string[]> {
  const home = os.homedir();
  const settings = await loadSettings();
  const roots: string[] = [];

  for (const p of CANONICAL_SKILL_PATHS) {
    if (p.scope === "global") {
      roots.push(path.join(home, p.relativePath));
    }
  }

  for (const proj of settings.watchedProjects) {
    const base = path.resolve(proj.path);
    for (const p of CANONICAL_SKILL_PATHS) {
      if (p.scope === "project") {
        roots.push(path.join(base, p.relativePath));
      }
    }
  }

  return roots;
}

/**
 * Best-effort skills-root relative path (e.g. `.codex/skills`) for a skill folder inside watched locations.
 */
export async function resolveSkillsRootRelativeForSkillFolder(
  skillFolder: string,
): Promise<string> {
  const resolved = path.resolve(skillFolder);
  const settings = await loadSettings();
  const allowed = await getAllowedSkillRoots();

  let bestRoot = "";
  let bestLen = -1;
  for (const root of allowed) {
    const r = path.resolve(root);
    if (isUnder(r, resolved) && r !== resolved && r.length > bestLen) {
      bestRoot = r;
      bestLen = r.length;
    }
  }

  if (!bestRoot) return "";

  const normBest = path.resolve(bestRoot);
  if (
    normBest.toLowerCase().startsWith(path.resolve(os.homedir()).toLowerCase() + path.sep)
  ) {
    return path.relative(os.homedir(), normBest).replace(/\\/g, "/");
  }

  for (const proj of settings.watchedProjects) {
    const base = path.resolve(proj.path);
    if (normBest.toLowerCase().startsWith(base.toLowerCase() + path.sep)) {
      return path.relative(base, normBest).replace(/\\/g, "/");
    }
  }

  return path.basename(normBest);
}

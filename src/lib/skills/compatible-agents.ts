import "server-only";
import path from "path";
import os from "os";
import { getMergedSkillPaths } from "@/lib/agents/merged-paths";
import { loadSettings } from "@/lib/settings/store";
import { isUnder } from "@/lib/skills/managed-paths";

/**
 * Which registered tool skill paths cover this skill folder (union of agent IDs).
 */
export async function compatibleAgentIdsForSkillFolder(
  skillFolder: string,
): Promise<string[]> {
  const resolvedSkill = path.resolve(skillFolder);
  const home = os.homedir();
  const settings = await loadSettings();
  const ids = new Set<string>();

  for (const merged of getMergedSkillPaths("global")) {
    const skillsRoot = path.join(home, merged.relativePath);
    if (isUnder(skillsRoot, resolvedSkill)) {
      for (const id of merged.agentIds) ids.add(id);
    }
  }

  for (const proj of settings.watchedProjects) {
    const base = path.resolve(proj.path);
    for (const merged of getMergedSkillPaths("project")) {
      const skillsRoot = path.join(base, merged.relativePath);
      if (isUnder(skillsRoot, resolvedSkill)) {
        for (const id of merged.agentIds) ids.add(id);
      }
    }
  }

  return [...ids].sort();
}

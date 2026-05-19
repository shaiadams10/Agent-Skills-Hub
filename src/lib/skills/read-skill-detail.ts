import "server-only";
import fs from "fs/promises";
import path from "path";
import os from "os";
import matter from "gray-matter";
import { parseSkillMd, type ParsedSkill } from "@/lib/scanner/parse-skill";
import { CANONICAL_SKILL_PATHS } from "@/lib/agents/skill-paths";
import { compatibleAgentIdsForSkillFolder } from "@/lib/skills/compatible-agents";
import {
  getAllowedSkillRoots,
  isUnder,
  resolveSkillsRootRelativeForSkillFolder,
} from "@/lib/skills/managed-paths";
import { loadSettings } from "@/lib/settings/store";
import type { InstallOrigin } from "@/lib/skills/install-origin";
import { resolveInstallOrigin } from "@/lib/skills/install-origin";

import type { SkillGitUpdateStatus } from "@/lib/skills/skill-update-types";
import { checkSkillGitUpdateCached } from "@/lib/skills/skill-git-update";

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export type SkillDetail = {
  skillMdPath: string;
  skillPath: string;
  skillDirName: string;
  markdownBody: string;
  parsed: ParsedSkill;
  scope: "global" | "project";
  rootLabel: string;
  compatibleAgentIds: string[];
  installOrigin: InstallOrigin;
  gitUpdateStatus: SkillGitUpdateStatus;
};

async function classifyScope(
  skillFolder: string,
): Promise<{ scope: "global" | "project"; rootLabel: string }> {
  const home = os.homedir();
  const globalRoots = CANONICAL_SKILL_PATHS.filter((p) => p.scope === "global").map((p) =>
    path.join(home, p.relativePath),
  );
  const resolvedSkill = path.resolve(skillFolder);
  for (const root of globalRoots) {
    if (isUnder(root, resolvedSkill))
      return { scope: "global", rootLabel: "Global" };
  }

  const settings = await loadSettings();
  for (const proj of settings.watchedProjects) {
    const base = path.resolve(proj.path);
    if (isUnder(base, resolvedSkill)) {
      const label = proj.label?.trim() || path.basename(base);
      return { scope: "project", rootLabel: label };
    }
  }

  return { scope: "project", rootLabel: "Project" };
}

/**
 * Loads SKILL.md from disk after verifying the path is under a managed skills root.
 */
export async function readSkillDetail(skillMdPath: string): Promise<SkillDetail> {
  const resolvedMd = path.resolve(skillMdPath.trim());
  if (path.basename(resolvedMd).toLowerCase() !== "skill.md") {
    throw new Error("Path must point to SKILL.md");
  }
  if (!(await pathExists(resolvedMd))) {
    throw new Error("SKILL.md not found");
  }

  const skillFolder = path.dirname(resolvedMd);
  const allowedRoots = await getAllowedSkillRoots();
  const ok = allowedRoots.some((root) => isUnder(root, skillFolder));
  if (!ok) {
    throw new Error("Skill is not in a managed location");
  }

  const raw = await fs.readFile(resolvedMd, "utf-8");
  const skillDirName = path.basename(skillFolder);
  const parsed = parseSkillMd(raw, skillDirName);
  const { content: markdownBody } = matter(raw);
  const { scope, rootLabel } = await classifyScope(skillFolder);
  const compatibleAgentIds = await compatibleAgentIdsForSkillFolder(skillFolder);
  const skillsRootRelative = await resolveSkillsRootRelativeForSkillFolder(skillFolder);
  const installOrigin = resolveInstallOrigin({
    skillPath: skillFolder,
    skillDirName,
    skillsRootRelative,
    scope,
    compatibleAgentIds,
    parsed,
  });
  const gitUpdateStatus = await checkSkillGitUpdateCached(skillFolder, {});

  return {
    skillMdPath: resolvedMd,
    skillPath: skillFolder,
    skillDirName,
    markdownBody: markdownBody.trim() || "(No body in SKILL.md)",
    parsed,
    scope,
    rootLabel,
    compatibleAgentIds,
    installOrigin,
    gitUpdateStatus,
  };
}

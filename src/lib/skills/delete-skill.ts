import "server-only";
import fs from "fs/promises";
import path from "path";
import { getAllowedSkillRoots, isUnder } from "@/lib/skills/managed-paths";

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Deletes a skill folder after verifying it lives under a known skills root
 * and contains SKILL.md.
 */
export async function deleteSkillFolder(skillPath: string): Promise<void> {
  const resolved = path.resolve(skillPath);
  const skillMd = path.join(resolved, "SKILL.md");

  if (!(await pathExists(skillMd))) {
    throw new Error("This folder is not a valid skill (missing SKILL.md)");
  }

  const allowedRoots = await getAllowedSkillRoots();
  const ok = allowedRoots.some((root) => isUnder(root, resolved));
  if (!ok) {
    throw new Error(
      "This skill path is not in a managed location. Delete it manually in File Explorer if needed.",
    );
  }

  await fs.rm(resolved, { recursive: true, force: true });
}

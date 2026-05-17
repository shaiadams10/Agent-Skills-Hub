import fs from "fs/promises";
import path from "path";
import os from "os";
import { CANONICAL_SKILL_PATHS } from "@/lib/agents/skill-paths";
import { getAgentById } from "@/lib/agents/registry";

export type InstallTarget = {
  agentId: string;
  scope: "project" | "global";
  projectPath?: string;
};

export async function installSkillFolder(
  sourceSkillPath: string,
  target: InstallTarget,
): Promise<{ destination: string }> {
  const agent = getAgentById(target.agentId);
  if (!agent) {
    throw new Error(`Unknown agent: ${target.agentId}`);
  }

  const loc = CANONICAL_SKILL_PATHS.find(
    (p) =>
      p.scope === target.scope && p.agentIds.includes(target.agentId),
  );
  if (!loc) {
    throw new Error(
      `${agent.name} does not support ${target.scope} skill installs`,
    );
  }

  const base =
    target.scope === "global"
      ? os.homedir()
      : target.projectPath
        ? path.resolve(target.projectPath)
        : null;

  if (!base) {
    throw new Error("Project path is required for project installs");
  }

  const skillName = path.basename(sourceSkillPath);
  const destRoot = path.join(base, loc.relativePath);
  const destination = path.join(destRoot, skillName);

  await fs.mkdir(destRoot, { recursive: true });

  const exists = await pathExists(destination);
  if (exists) {
    throw new Error(
      `A skill named "${skillName}" is already installed at this location`,
    );
  }

  await copyDir(sourceSkillPath, destination);
  return { destination };
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

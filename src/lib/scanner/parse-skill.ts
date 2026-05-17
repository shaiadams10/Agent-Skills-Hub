import matter from "gray-matter";
import { z } from "zod";
import { AGENT_REGISTRY } from "@/lib/agents/registry";

const frontmatterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  compatibility: z.string().optional(),
  install_source: z.enum(["manual", "agent_tool", "unknown"]).optional(),
  installed_by: z.string().optional(),
});

export type ParsedSkill = {
  name: string;
  description: string;
  compatibility?: string;
  installSource?: "manual" | "agent_tool" | "unknown";
  installedByAgentId?: string;
  valid: boolean;
  issues: string[];
};

export function parseSkillMd(
  content: string,
  folderName: string,
): ParsedSkill {
  const issues: string[] = [];
  let data: z.infer<typeof frontmatterSchema> = {};

  try {
    const parsed = matter(content);
    const result = frontmatterSchema.safeParse(parsed.data);
    if (result.success) {
      data = result.data;
    } else {
      issues.push("Invalid frontmatter in SKILL.md");
    }
  } catch {
    issues.push("Could not read SKILL.md");
  }

  const name = data.name?.trim() || folderName;
  const description =
    data.description?.trim() || "No description in SKILL.md";

  if (data.name && data.name !== folderName) {
    issues.push(
      `Skill folder "${folderName}" does not match name "${data.name}" in frontmatter`,
    );
  }

  let installedByAgentId: string | undefined;
  if (data.installed_by?.trim()) {
    const id = data.installed_by.trim();
    if (AGENT_REGISTRY.some((a) => a.id === id)) {
      installedByAgentId = id;
    } else {
      issues.push(
        `installed_by "${id}" is unknown — use an id from the Hub registry (e.g. codex, cursor, copilot).`,
      );
    }
  }

  return {
    name,
    description,
    compatibility: data.compatibility,
    installSource: data.install_source,
    installedByAgentId,
    valid: issues.length === 0,
    issues,
  };
}

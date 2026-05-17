import {
  CANONICAL_SKILL_PATHS,
  type CanonicalSkillPath,
} from "@/lib/agents/skill-paths";
import type { SkillScope } from "@/lib/agents/registry";

export type MergedSkillPath = {
  relativePath: string;
  agentIds: string[];
  recursive: boolean;
  docUrls: string[];
};

/** One entry per relative path per scope, with merged agent IDs. */
export function getMergedSkillPaths(scope: SkillScope): MergedSkillPath[] {
  const map = new Map<string, MergedSkillPath>();

  for (const p of CANONICAL_SKILL_PATHS.filter((x) => x.scope === scope)) {
    const key = p.relativePath.toLowerCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        relativePath: p.relativePath,
        agentIds: [...p.agentIds],
        recursive: p.recursive,
        docUrls: [p.docUrl],
      });
    } else {
      const ids = new Set([...existing.agentIds, ...p.agentIds]);
      existing.agentIds = [...ids];
      existing.recursive = existing.recursive || p.recursive;
      if (!existing.docUrls.includes(p.docUrl)) {
        existing.docUrls.push(p.docUrl);
      }
    }
  }

  return [...map.values()];
}

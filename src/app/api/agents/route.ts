import { NextResponse } from "next/server";
import type { SkillScope } from "@/lib/agents/registry";
import { AGENT_REGISTRY } from "@/lib/agents/registry";
import { CANONICAL_SKILL_PATHS } from "@/lib/agents/skill-paths";

function pathsForAgent(agentId: string, scope: SkillScope): string[] {
  const rel = CANONICAL_SKILL_PATHS.filter(
    (p) => p.scope === scope && p.agentIds.includes(agentId),
  ).map((p) => p.relativePath);
  return [...new Set(rel)].sort();
}

export async function GET() {
  return NextResponse.json(
    AGENT_REGISTRY.map((a) => ({
      id: a.id,
      name: a.name,
      docsUrl: a.docsUrl,
      projectPaths: pathsForAgent(a.id, "project"),
      globalPaths: pathsForAgent(a.id, "global"),
    })),
  );
}

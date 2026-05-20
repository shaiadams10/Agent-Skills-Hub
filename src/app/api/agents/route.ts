import { NextResponse } from "next/server";
import { AGENT_REGISTRY } from "@/lib/agents/registry";
import { getRelativePathsForAgent } from "@/lib/agents/skill-paths";

export async function GET() {
  return NextResponse.json(
    AGENT_REGISTRY.map((a) => ({
      id: a.id,
      name: a.name,
      docsUrl: a.docsUrl,
      projectPaths: getRelativePathsForAgent(a.id, "project"),
      globalPaths: getRelativePathsForAgent(a.id, "global"),
    })),
  );
}

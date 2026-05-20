import { NextResponse } from "next/server";
import { scanAll } from "@/lib/scanner/skill-scanner";
import { loadSettings } from "@/lib/settings/store";
import { enrichScanWithGitUpdates } from "@/lib/skills/skill-git-update";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkUpdates = searchParams.get("checkUpdates") !== "0";
  const forceGit = searchParams.get("forceGit") === "1";

  const settings = await loadSettings();
  const result = await scanAll(settings.watchedProjects);

  if (!checkUpdates) {
    return NextResponse.json({
      global: result.global,
      projects: result.projects,
      scannedAt: new Date().toISOString(),
      enabledAgentIds: settings.enabledAgentIds,
      updateCheckSummary: {
        checkedAt: new Date().toISOString(),
        gitSkillFolders: 0,
        updateAvailableCount: 0,
        errorsCount: 0,
        cacheTtlHours: 4,
        forced: false,
        skipped: true,
      },
    });
  }

  const enriched = await enrichScanWithGitUpdates(result, { force: forceGit });

  return NextResponse.json({
    global: enriched.global,
    projects: enriched.projects,
    scannedAt: new Date().toISOString(),
    enabledAgentIds: settings.enabledAgentIds,
    updateCheckSummary: enriched.updateCheckSummary,
  });
}

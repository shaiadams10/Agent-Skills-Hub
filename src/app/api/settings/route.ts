import { NextResponse } from "next/server";
import { loadSettings, patchSettings } from "@/lib/settings/store";
import type { HubSettings } from "@/lib/settings/store";

export async function GET() {
  const settings = await loadSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<HubSettings>;
  const patch: Partial<HubSettings> = {};

  if (body.enabledAgentIds !== undefined) patch.enabledAgentIds = body.enabledAgentIds;
  if (body.watchedProjects !== undefined) patch.watchedProjects = body.watchedProjects;
  if (body.onboardingComplete !== undefined) patch.onboardingComplete = body.onboardingComplete;
  if (body.colorScheme !== undefined) patch.colorScheme = body.colorScheme;

  const saved = await patchSettings(patch);
  return NextResponse.json(saved);
}

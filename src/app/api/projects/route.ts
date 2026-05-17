import { NextResponse } from "next/server";
import {
  addWatchedProject,
  loadSettings,
  removeWatchedProject,
} from "@/lib/settings/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { path: string; label?: string };
  if (!body.path?.trim()) {
    return NextResponse.json({ error: "Project path is required" }, { status: 400 });
  }
  const settings = await addWatchedProject(body.path.trim(), body.label?.trim());
  return NextResponse.json(settings);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectPath = searchParams.get("path");
  if (!projectPath) {
    return NextResponse.json({ error: "path query is required" }, { status: 400 });
  }
  const settings = await removeWatchedProject(projectPath);
  return NextResponse.json(settings);
}

export async function GET() {
  const settings = await loadSettings();
  return NextResponse.json(settings.watchedProjects);
}

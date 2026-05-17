import { NextResponse } from "next/server";
import { deleteSkillFolder } from "@/lib/skills/delete-skill";

export async function DELETE(request: Request) {
  const body = (await request.json()) as { skillPath?: string };
  const skillPath = body.skillPath?.trim();

  if (!skillPath) {
    return NextResponse.json(
      { error: "skillPath is required" },
      { status: 400 },
    );
  }

  try {
    await deleteSkillFolder(skillPath);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not delete skill";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

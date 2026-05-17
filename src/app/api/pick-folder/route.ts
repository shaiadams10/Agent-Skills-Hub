import { NextResponse } from "next/server";
import { pickFolder } from "@/lib/dialog/pick-folder";

export async function POST() {
  const result = await pickFolder();

  if (result.error) {
    return NextResponse.json(
      { cancelled: false, path: null, error: result.error },
      { status: 500 },
    );
  }

  if (!result.path) {
    return NextResponse.json({ cancelled: true, path: null });
  }

  return NextResponse.json({ cancelled: false, path: result.path });
}

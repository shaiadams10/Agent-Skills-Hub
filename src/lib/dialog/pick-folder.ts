import "server-only";
import { existsSync } from "fs";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";
import os from "os";

const execFileAsync = promisify(execFile);

const PICK_TIMEOUT_MS = 120_000;

export type PickFolderResult = {
  path: string | null;
  error?: string;
};

/** Resolve pick-folder-win.exe from cwd or parents (Next dev may vary cwd). */
function resolveWindowsPickerExe(): string | null {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(
      dir,
      "src",
      "lib",
      "dialog",
      "bin",
      "pick-folder-win.exe",
    );
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** Opens a native folder picker on the user's machine (local app only). */
export async function pickFolder(): Promise<PickFolderResult> {
  const platform = os.platform();

  if (platform === "win32") {
    return pickFolderWindows();
  }

  if (platform === "darwin") {
    const pathResult = await pickFolderMac();
    return { path: pathResult };
  }

  const pathResult = await pickFolderLinux();
  return { path: pathResult };
}

async function pickFolderWindows(): Promise<PickFolderResult> {
  const exe = resolveWindowsPickerExe();
  if (!exe) {
    return {
      path: null,
      error:
        "pick-folder-win.exe not found. From the project root run: npm run build:picker",
    };
  }

  try {
    const { stdout } = await execFileAsync(exe, [], {
      timeout: PICK_TIMEOUT_MS,
      windowsHide: false,
    });
    const chosen = stdout.trim();
    return { path: chosen.length > 0 ? chosen : null };
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: string | number }).code
        : undefined;
    if (code === 1 || code === "1") {
      return { path: null };
    }
    const message =
      err instanceof Error ? err.message : "Folder picker failed to start";
    return { path: null, error: message };
  }
}

async function pickFolderMac(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "osascript",
      [
        "-e",
        'POSIX path of (choose folder with prompt "Select your project folder")',
      ],
      { timeout: PICK_TIMEOUT_MS },
    );
    const chosen = stdout.trim();
    return chosen.length > 0 ? chosen : null;
  } catch {
    return null;
  }
}

async function pickFolderLinux(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "zenity",
      ["--file-selection", "--directory", "--title=Select your project folder"],
      { timeout: PICK_TIMEOUT_MS },
    );
    const chosen = stdout.trim();
    return chosen.length > 0 ? chosen : null;
  } catch {
    return null;
  }
}

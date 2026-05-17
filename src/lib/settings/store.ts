import fs from "fs/promises";
import path from "path";
import os from "os";
import { KNOWN_AGENT_IDS } from "@/lib/agents/registry";

export type ColorScheme = "light" | "dark";

export type WatchedProject = { path: string; label?: string };

export type HubSettings = {
  version: 1;
  /** Agents the user cares about — empty means all */
  enabledAgentIds: string[];
  watchedProjects: WatchedProject[];
  onboardingComplete: boolean;
  colorScheme?: ColorScheme;
};

const DEFAULT_SETTINGS: HubSettings = {
  version: 1,
  enabledAgentIds: [],
  watchedProjects: [],
  onboardingComplete: false,
  colorScheme: "light",
};

function settingsDir(): string {
  return path.join(os.homedir(), ".agent-skills-hub");
}

function settingsFile(): string {
  return path.join(settingsDir(), "settings.json");
}

function sanitizeSettings(settings: HubSettings): HubSettings {
  const colorScheme =
    settings.colorScheme === "dark" || settings.colorScheme === "light"
      ? settings.colorScheme
      : DEFAULT_SETTINGS.colorScheme;

  const watchedProjects = Array.isArray(settings.watchedProjects)
    ? settings.watchedProjects
        .filter((p) => p && typeof p.path === "string" && p.path.trim().length > 0)
        .map((p) => ({
          path: path.resolve(p.path.trim()),
          label: p.label?.trim() || undefined,
        }))
    : [];

  const enabledAgentIds = Array.isArray(settings.enabledAgentIds)
    ? settings.enabledAgentIds.filter((id) => KNOWN_AGENT_IDS.has(id))
    : [];

  return {
    version: 1,
    enabledAgentIds,
    watchedProjects,
    onboardingComplete: Boolean(settings.onboardingComplete),
    colorScheme,
  };
}

let persistQueue: Promise<void> = Promise.resolve();

async function atomicWriteJson(filePath: string, data: HubSettings): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  const tmp = path.join(dir, `settings.${process.pid}.tmp.json`);
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, payload, { encoding: "utf-8" });
  try {
    await fs.rename(tmp, filePath);
  } catch {
    await fs.unlink(filePath).catch(() => undefined);
    await fs.rename(tmp, filePath);
  }
}

export async function loadSettings(): Promise<HubSettings> {
  try {
    const raw = await fs.readFile(settingsFile(), "utf-8");
    const parsed = JSON.parse(raw) as Partial<HubSettings>;
    return sanitizeSettings({ ...DEFAULT_SETTINGS, ...parsed, version: 1 });
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: HubSettings): Promise<HubSettings> {
  const clean = sanitizeSettings(settings);
  const file = settingsFile();

  const done = persistQueue.then(() => atomicWriteJson(file, clean));
  persistQueue = done.then(
    () => undefined,
    () => undefined,
  );
  await done;

  return clean;
}

/** Update only fields present in `patch` — avoids wiping projects/agents on partial saves. */
export async function patchSettings(patch: Partial<HubSettings>): Promise<HubSettings> {
  const current = await loadSettings();
  const next: HubSettings = { ...current, version: 1 };

  if (patch.enabledAgentIds !== undefined) {
    next.enabledAgentIds = patch.enabledAgentIds;
  }
  if (patch.watchedProjects !== undefined) {
    next.watchedProjects = patch.watchedProjects;
  }
  if (patch.onboardingComplete !== undefined) {
    next.onboardingComplete = patch.onboardingComplete;
  }
  if (patch.colorScheme !== undefined) {
    next.colorScheme = patch.colorScheme;
  }

  return saveSettings(next);
}

export async function addWatchedProject(
  projectPath: string,
  label?: string,
): Promise<HubSettings> {
  const settings = await loadSettings();
  const resolved = path.resolve(projectPath);
  if (settings.watchedProjects.some((p) => path.resolve(p.path) === resolved)) {
    return settings;
  }
  settings.watchedProjects.push({ path: resolved, label });
  return saveSettings(settings);
}

export async function removeWatchedProject(
  projectPath: string,
): Promise<HubSettings> {
  const settings = await loadSettings();
  const resolved = path.resolve(projectPath);
  settings.watchedProjects = settings.watchedProjects.filter(
    (p) => path.resolve(p.path) !== resolved,
  );
  return saveSettings(settings);
}

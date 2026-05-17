export type ColorScheme = "light" | "dark";

export const THEME_STORAGE_KEY = "agent-skills-hub-theme";

/** SVG morph in (wave covers screen) */
export const THEME_MORPH_SHOW_MS = 520;
/** SVG morph out (wave reveals new theme) */
export const THEME_MORPH_HIDE_MS = 520;

export function isDarkScheme(scheme: ColorScheme): boolean {
  return scheme === "dark";
}

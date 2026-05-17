import type { ColorScheme } from "@/lib/theme/constants";

/** Matches @theme / .dark backgrounds in globals.css */
export const SCHEME_BACKGROUNDS: Record<ColorScheme, string> = {
  light: "#fcf9f8",
  dark: "#1c1b22",
};

export function backgroundForScheme(scheme: ColorScheme): string {
  return SCHEME_BACKGROUNDS[scheme];
}

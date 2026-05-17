import type { ColorScheme } from "@/lib/theme/constants";
import { applySchemeToDocument, prefersReducedMotion } from "@/lib/theme/apply-scheme";

export type ThemeMorphRunner = (scheme: ColorScheme) => Promise<void>;

let runner: ThemeMorphRunner | null = null;
let runSerial = 0;

export function setThemeMorphRunner(fn: ThemeMorphRunner | null) {
  runner = fn;
}

export async function playThemeMorphTransition(scheme: ColorScheme): Promise<void> {
  if (prefersReducedMotion()) {
    applySchemeToDocument(scheme);
    return;
  }

  if (!runner) {
    applySchemeToDocument(scheme);
    return;
  }

  const id = ++runSerial;
  await runner(scheme);
  if (id !== runSerial) return;
}

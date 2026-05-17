import type { ColorScheme } from "@/lib/theme/constants";
import { isDarkScheme } from "@/lib/theme/constants";

export function applySchemeToDocument(scheme: ColorScheme) {
  const root = document.documentElement;
  const dark = isDarkScheme(scheme);
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

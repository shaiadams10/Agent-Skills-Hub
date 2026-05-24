"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { MOTION_DURATION } from "@/lib/motion/tokens";

/** SSR-safe check (matches theme morph behavior). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Framer hook + instant duration helper for transitions.
 * When reduced: use instant durations and skip layout/height animations.
 */
export function useMotionPrefs() {
  const reduced = useFramerReducedMotion();
  return {
    reduced: reduced ?? false,
    duration: (normal: number, instant = MOTION_DURATION.instant) =>
      reduced ? instant : normal,
  };
}

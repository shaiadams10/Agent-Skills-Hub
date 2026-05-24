/**
 * Tailwind class bundles for neo-brutalist press/lift affordances.
 * Prefer transform + box-shadow; avoid animating width/height on buttons.
 * Durations/easing match `MOTION_DURATION_MS.section` and `MOTION_CSS_EASE.out`.
 */

/** Standard brutal button: lift on hover, press on active. */
export const brutalLift =
  "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-brutal-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-brutal";

export const brutalPress =
  "transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-x-1 active:translate-y-1 active:shadow-none motion-reduce:transition-none motion-reduce:active:translate-x-0 motion-reduce:active:translate-y-0";

export const brutalPressSm =
  "transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none motion-reduce:active:translate-x-0 motion-reduce:active:translate-y-0";

export const brutalColorHover =
  "transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/** Chevron rotation for expand/collapse (pair with `rotate-180` when open). */
export const brutalChevronRotate =
  "transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0";

const collapseGridBase =
  "grid overflow-hidden transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0";

/** CSS grid row collapse (GPU-friendly; no height tween). */
export function brutalCollapseGrid(open: boolean): string {
  return `${collapseGridBase} ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`;
}

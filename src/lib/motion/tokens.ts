/**
 * Unified motion tokens for Agent Skills Hub.
 * Use these everywhere — CSS transitions, Tailwind arbitrary values, and Framer Motion.
 */

/** Durations in seconds (Framer Motion `transition.duration`). */
export const MOTION_DURATION = {
  /** Near-instant feedback; reduced-motion fallback. */
  instant: 0.08,
  /** Microinteractions: icon rotate, tooltip, toggles. */
  fast: 0.18,
  /** Buttons, fades, small reveals. */
  normal: 0.3,
  /** Cards entering grid, read-more, modal exit. */
  moderate: 0.38,
  /** Modal enter, theme content restore. */
  slow: 0.52,
  /** Section accordions, large collapses. */
  section: 0.6,
} as const;

/** Durations in milliseconds (CSS `transition-duration`). */
export const MOTION_DURATION_MS = {
  instant: 80,
  fast: 180,
  normal: 300,
  moderate: 380,
  slow: 520,
  section: 600,
} as const;

/** Primary easing — smooth deceleration (Material-inspired expo-out). */
export const MOTION_EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Exit / dismiss — quicker settle. */
export const MOTION_EASE_IN = [0.4, 0, 0.2, 1] as const;

/** Symmetric transitions (theme morph helpers). */
export const MOTION_EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** CSS `cubic-bezier()` strings — match Framer tuples above. */
export const MOTION_CSS_EASE = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  in: "cubic-bezier(0.4, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** Stagger delays for grouped children (modals, lists). */
export const MOTION_STAGGER = {
  children: 0.05,
  childrenExit: 0.04,
  delayChildren: 0.02,
} as const;

/** Standard transform offsets (px). */
export const MOTION_OFFSET = {
  sm: 8,
  md: 16,
  lg: 24,
} as const;

/** Modal / overlay scale endpoints. */
export const MOTION_SCALE = {
  panelEnter: 0.94,
  panelExit: 0.96,
  cardEnter: 0.98,
} as const;

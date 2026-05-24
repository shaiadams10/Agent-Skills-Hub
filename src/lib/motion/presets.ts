import type { Transition, Variants } from "framer-motion";
import {
  MOTION_DURATION,
  MOTION_EASE_IN,
  MOTION_EASE_OUT,
  MOTION_OFFSET,
  MOTION_SCALE,
  MOTION_STAGGER,
} from "@/lib/motion/tokens";

export function motionTransition(
  duration: number,
  ease: readonly [number, number, number, number] = MOTION_EASE_OUT,
  reduced?: boolean | null,
): Transition {
  return {
    duration: reduced ? MOTION_DURATION.instant : duration,
    ease: reduced ? "linear" : ease,
  };
}

export function fadeVariants(reduced?: boolean | null): Variants {
  const enter = motionTransition(MOTION_DURATION.normal, MOTION_EASE_OUT, reduced);
  const exit = motionTransition(MOTION_DURATION.fast, MOTION_EASE_IN, reduced);
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: enter },
    exit: { opacity: 0, transition: exit },
  };
}

export function fadeSlideYVariants(
  reduced?: boolean | null,
  y = MOTION_OFFSET.md,
): Variants {
  const enter = motionTransition(MOTION_DURATION.moderate, MOTION_EASE_OUT, reduced);
  const exit = motionTransition(MOTION_DURATION.normal, MOTION_EASE_IN, reduced);
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: enter },
    exit: { opacity: 0, y: -MOTION_OFFSET.sm, transition: exit },
  };
}

export function fadeScalePanelVariants(reduced?: boolean | null): Variants {
  const enter = motionTransition(MOTION_DURATION.normal, MOTION_EASE_OUT, reduced);
  const exit = motionTransition(MOTION_DURATION.fast, MOTION_EASE_IN, reduced);
  return {
    hidden: { opacity: 0, scale: MOTION_SCALE.panelEnter, y: MOTION_OFFSET.md },
    visible: { opacity: 1, scale: 1, y: 0, transition: enter },
    exit: { opacity: 0, scale: MOTION_SCALE.panelExit, y: 10, transition: exit },
  };
}

export function staggerRootVariants(): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: MOTION_STAGGER.children,
        delayChildren: MOTION_STAGGER.delayChildren,
      },
    },
    exit: {
      transition: {
        staggerChildren: MOTION_STAGGER.childrenExit,
        staggerDirection: -1,
      },
    },
  };
}

export function gridItemVariants(reduced?: boolean | null): Variants {
  const t = motionTransition(MOTION_DURATION.moderate, MOTION_EASE_OUT, reduced);
  return {
    hidden: { opacity: 0, y: MOTION_OFFSET.md, scale: MOTION_SCALE.cardEnter },
    visible: { opacity: 1, y: 0, scale: 1, transition: t },
    ...(reduced
      ? {}
      : {
          exit: {
            opacity: 0,
            y: -MOTION_OFFSET.sm,
            scale: MOTION_SCALE.cardEnter,
            transition: motionTransition(MOTION_DURATION.normal, MOTION_EASE_IN, false),
          },
        }),
  };
}

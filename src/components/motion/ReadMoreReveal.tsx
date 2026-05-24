"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { motionTransition } from "@/lib/motion/presets";
import { MOTION_DURATION, MOTION_EASE_OUT } from "@/lib/motion/tokens";
import { useMotionPrefs } from "@/lib/motion/reduced-motion";

/**
 * Expands short description text. Uses height animation (layout) — acceptable for
 * small blocks only; prefer MotionCollapse for large panels.
 */
export function ReadMoreReveal({
  show,
  children,
  className,
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  const { reduced } = useMotionPrefs();
  const opacityTween = motionTransition(MOTION_DURATION.normal, MOTION_EASE_OUT, reduced);
  const heightTween = motionTransition(MOTION_DURATION.moderate, MOTION_EASE_OUT, reduced);

  return (
    <AnimatePresence initial={false} mode="wait">
      {show ? (
        <motion.div
          key="reveal"
          className={className}
          style={{ transformOrigin: "top center", overflow: "hidden" }}
          initial={reduced ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={
            reduced
              ? { duration: MOTION_DURATION.instant }
              : { opacity: opacityTween, height: heightTween }
          }
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

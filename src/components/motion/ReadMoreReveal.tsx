"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const TWEEN = { duration: 0.34, ease: EASE_OUT };

export function ReadMoreReveal({
  show,
  children,
  className,
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      {show ? (
        <motion.div
          key="reveal"
          className={className}
          style={{ transformOrigin: "top center", overflow: "hidden" }}
          initial={reduce ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={reduce ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
          transition={
            reduce
              ? { duration: 0.12 }
              : {
                  opacity: TWEEN,
                  height: { duration: 0.36, ease: EASE_OUT },
                }
          }
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

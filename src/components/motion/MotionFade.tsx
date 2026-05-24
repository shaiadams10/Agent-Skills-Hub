"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeVariants, fadeSlideYVariants } from "@/lib/motion/presets";
import { useMotionPrefs } from "@/lib/motion/reduced-motion";

type MotionFadeProps = {
  show: boolean;
  children: ReactNode;
  className?: string;
  /** Slight vertical slide (tooltips, banners). */
  slide?: boolean;
  mode?: "wait" | "sync" | "popLayout";
};

export function MotionFade({
  show,
  children,
  className,
  slide = false,
  mode = "wait",
}: MotionFadeProps) {
  const { reduced } = useMotionPrefs();
  const variants = slide ? fadeSlideYVariants(reduced) : fadeVariants(reduced);

  return (
    <AnimatePresence initial={false} mode={mode}>
      {show ? (
        <motion.div
          key="motion-fade"
          className={className}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 0.2, 1] as const;

const rootVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

function childVariants(reduce: boolean | null) {
  const enter = reduce ? 0.01 : 0.3;
  const exit = reduce ? 0.01 : 0.22;
  const enterT = { duration: enter, ease: EASE_OUT };
  const exitT = { duration: exit, ease: EASE_IN };

  return {
    backdrop: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: enterT },
      exit: { opacity: 0, transition: exitT },
    },
    panel: {
      hidden: { opacity: 0, scale: 0.94, y: 16 },
      visible: { opacity: 1, scale: 1, y: 0, transition: enterT },
      exit: { opacity: 0, scale: 0.96, y: 10, transition: exitT },
    },
  };
}

export function BrutalModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.focus(), 80);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const variants = childVariants(reduceMotion);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {open ? (
        <motion.div
          key="brutal-modal"
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6"
          variants={rootVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="presentation"
          onAnimationStart={() => {
            document.body.style.overflow = "hidden";
          }}
        >
          <motion.button
            type="button"
            variants={variants.backdrop}
            className="absolute inset-0 cursor-default bg-on-background/50 backdrop-blur-[1px]"
            aria-label="Close dialog"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            variants={variants.panel}
            className="relative flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden border-[3px] border-on-background bg-primary-fixed shadow-brutal-lg outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b-[3px] border-on-background bg-primary-fixed px-4 py-3 sm:px-6">
              <h2
                id={titleId}
                className="text-lg font-bold uppercase text-on-primary-fixed sm:text-xl"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-on-background bg-surface-container-lowest text-on-surface shadow-brutal-sm transition-all hover:bg-surface-variant active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <MaterialIcon name="close" />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

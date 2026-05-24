"use client";

import type { ReactNode } from "react";
import { brutalCollapseGrid } from "@/lib/motion/css";

type MotionCollapseProps = {
  open: boolean;
  children: ReactNode;
  id?: string;
  className?: string;
};

/**
 * GPU-friendly expand/collapse via CSS grid row animation.
 * Prefer over Framer `height: "auto"` for large panels.
 */
export function MotionCollapse({ open, children, id, className }: MotionCollapseProps) {
  return (
    <div id={id} className={`${brutalCollapseGrid(open)} ${className ?? ""}`.trim()}>
      <div className="min-h-0">
        <div className={!open ? "pointer-events-none select-none" : undefined} aria-hidden={!open}>
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const EASE = [0.22, 1, 0.36, 1] as const;

type ExpandableRevealGridProps<T> = {
  items: T[];
  initialCount?: number;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  gridClassName?: string;
  showMoreLabel?: (hiddenCount: number) => string;
};

export function ExpandableRevealGrid<T>({
  items,
  initialCount = 3,
  getKey,
  renderItem,
  gridClassName = "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
  showMoreLabel = (n) => `Show ${n} more`,
}: ExpandableRevealGridProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const canCollapse = items.length > initialCount;
  const visible = expanded || !canCollapse ? items : items.slice(0, initialCount);
  const hiddenCount = items.length - initialCount;

  return (
    <motion.div layout className="flex flex-col gap-4">
      <motion.div layout className={gridClassName}>
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item) => (
            <motion.div
              key={getKey(item)}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {canCollapse && (
        <div className="flex justify-center">
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 border-[3px] border-on-background bg-surface-container-lowest px-6 py-3 text-xs font-bold uppercase shadow-brutal transition-all hover:bg-primary-container hover:text-on-primary-container active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <MaterialIcon name="expand_more" />
              {showMoreLabel(hiddenCount)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex items-center gap-2 border-[3px] border-on-background bg-surface-container-lowest px-6 py-3 text-xs font-bold uppercase shadow-brutal transition-all hover:bg-surface-variant active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <MaterialIcon name="expand_less" />
              Show less
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

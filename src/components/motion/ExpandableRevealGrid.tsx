"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { gridItemVariants } from "@/lib/motion/presets";
import { brutalPressSm } from "@/lib/motion/css";
import { useMotionPrefs } from "@/lib/motion/reduced-motion";

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
  const { reduced } = useMotionPrefs();
  const canCollapse = items.length > initialCount;
  const visible = expanded || !canCollapse ? items : items.slice(0, initialCount);
  const hiddenCount = items.length - initialCount;
  const itemVariants = gridItemVariants(reduced);

  return (
    <motion.div layout={!reduced} className="flex flex-col gap-4">
      <motion.div layout={!reduced} className={gridClassName}>
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item) => (
            <motion.div
              key={getKey(item)}
              layout={!reduced}
              variants={itemVariants}
              initial={reduced ? false : "hidden"}
              animate="visible"
              exit={reduced ? undefined : "exit"}
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
              className={`inline-flex items-center gap-2 border-[3px] border-on-background bg-surface-container-lowest px-6 py-3 text-xs font-bold uppercase shadow-brutal hover:bg-primary-container hover:text-on-primary-container ${brutalPressSm}`}
            >
              <MaterialIcon name="expand_more" />
              {showMoreLabel(hiddenCount)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className={`inline-flex items-center gap-2 border-[3px] border-on-background bg-surface-container-lowest px-6 py-3 text-xs font-bold uppercase shadow-brutal hover:bg-surface-variant ${brutalPressSm}`}
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

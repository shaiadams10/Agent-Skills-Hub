"use client";

import { useId, useState, type ReactNode } from "react";
import { MotionChevron } from "@/components/motion/MotionChevron";
import { MotionCollapse } from "@/components/motion/MotionCollapse";
import { brutalPressSm } from "@/lib/motion/css";

export function CollapsibleSkillSection({
  title,
  badge,
  titleExtra,
  defaultOpen = true,
  children,
}: {
  title: string;
  badge?: ReactNode;
  /** Rendered after the badge in the section header (e.g. Add project). */
  titleExtra?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-btn`;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-on-background pb-3">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-bold uppercase md:text-3xl">{title}</h2>
          {badge}
          {titleExtra}
        </div>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-2 border-[3px] border-on-background bg-surface-container-lowest px-4 py-2 text-xs font-bold uppercase shadow-brutal hover:bg-primary-container motion-reduce:hover:bg-surface-container-lowest ${brutalPressSm}`}
        >
          <MotionChevron open={open} />
          {open ? "Hide" : "Show"}
        </button>
      </div>
      <MotionCollapse id={panelId} open={open}>
        {children}
      </MotionCollapse>
    </section>
  );
}

"use client";

import { useId, useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
          className="inline-flex items-center gap-2 border-[3px] border-on-background bg-surface-container-lowest px-4 py-2 text-xs font-bold uppercase shadow-brutal transition-all hover:bg-primary-container active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:hover:bg-surface-container-lowest"
        >
          <MaterialIcon
            name="expand_more"
            className={`transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
          {open ? "Hide" : "Show"}
        </button>
      </div>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className={!open ? "pointer-events-none select-none" : undefined} aria-hidden={!open}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ReadMoreReveal } from "@/components/motion/ReadMoreReveal";

export function SystemModuleCard({
  title,
  titleClassName = "text-on-surface",
  headerClassName,
  icon,
  summary,
  detail,
  tags,
}: {
  title: string;
  /** Text on the colored header band — pair with semantic *-fixed header backgrounds */
  titleClassName?: string;
  headerClassName: string;
  icon: string;
  summary: string;
  detail: string;
  tags: string[];
}) {
  const [open, setOpen] = useState(false);
  const hasDetail = detail.trim().length > 0;

  return (
    <article className="flex w-full min-h-[18rem] flex-col self-start border-[3px] border-on-background bg-surface-container-lowest shadow-brutal transition-all duration-200 hover:-translate-y-1 hover:shadow-brutal-hover">
      <div
        className={`flex shrink-0 items-center gap-3 border-b-[3px] border-on-background p-4 ${headerClassName}`}
      >
        <MaterialIcon
          name={icon}
          fill
          className={`border-2 border-current/30 bg-surface-container-lowest/80 p-1 !text-[28px] leading-none ${titleClassName}`}
        />
        <h4 className={`text-xl font-bold ${titleClassName}`}>{title}</h4>
      </div>
      <div className="flex flex-col gap-3 p-6">
        <p className="min-h-[4.5rem] text-on-surface-variant">{summary}</p>
        {hasDetail ? (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="min-h-6 shrink-0 self-start border-2 border-transparent px-1 text-left text-xs font-bold uppercase text-primary underline decoration-2 underline-offset-2 hover:bg-primary-container/30"
          >
            {open ? "Read less" : "Read more"}
          </button>
        ) : (
          <span className="min-h-6 shrink-0" aria-hidden />
        )}
        <ReadMoreReveal show={hasDetail && open}>
          <p className="text-sm leading-relaxed text-on-surface-variant">{detail}</p>
        </ReadMoreReveal>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {tags.map((t) => (
            <span
              key={t}
              className="border-2 border-on-background bg-surface-variant px-2 py-1 font-mono text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

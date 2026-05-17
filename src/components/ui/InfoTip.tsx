"use client";

import { useId, useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function InfoTip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const tipId = `${id}-tip`;

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="inline-flex h-7 w-7 items-center justify-center border-2 border-on-background bg-surface-container text-on-surface-variant shadow-brutal-sm transition-colors hover:bg-primary-container hover:text-on-primary-container"
      >
        <MaterialIcon name="info" className="!text-base" />
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] border-[3px] border-on-background bg-surface-container-lowest p-4 text-left text-sm font-normal normal-case leading-snug text-on-surface-variant shadow-brutal"
        >
          {children}
        </span>
      )}
    </span>
  );
}

"use client";

import type { InstallOrigin } from "@/lib/skills/install-origin";

export function InstallOriginBadge({ origin }: { origin: InstallOrigin }) {
  const cls =
    origin.kind === "manual"
      ? "border-secondary bg-secondary-fixed text-secondary"
      : origin.kind === "agent"
        ? "border-primary bg-primary-fixed text-on-primary-fixed"
        : "border-outline bg-surface-dim text-on-surface-variant";

  const hint =
    origin.confidence === "high" || origin.confidence === "declared"
      ? origin.detail
      : `${origin.detail} (${origin.confidence === "medium" ? "Estimated" : "Low confidence"})`;

  return (
    <span
      title={hint}
      className={`inline-flex max-w-full min-w-0 cursor-help border-2 border-on-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${cls}`}
    >
      <span className="truncate">{origin.summary}</span>
    </span>
  );
}

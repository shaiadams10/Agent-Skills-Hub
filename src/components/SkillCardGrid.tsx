import type { ReactNode } from "react";

/** Top-aligned grid: only the card you expand grows; neighbors keep their height. */
export function SkillCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

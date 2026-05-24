"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { brutalChevronRotate } from "@/lib/motion/css";

export function MotionChevron({
  open,
  name = "expand_more",
  className,
}: {
  open: boolean;
  name?: string;
  className?: string;
}) {
  return (
    <MaterialIcon
      name={name}
      className={`${brutalChevronRotate} ${open ? "rotate-180" : ""} ${className ?? ""}`.trim()}
    />
  );
}

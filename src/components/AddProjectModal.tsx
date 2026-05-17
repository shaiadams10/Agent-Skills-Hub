"use client";

import { useState } from "react";
import { AddProjectForm } from "@/components/AddProjectForm";
import { BrutalModal } from "@/components/ui/BrutalModal";
import { INSTALLED_TOOLBAR_BTN } from "@/components/installed/installed-toolbar";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const COMPACT_BTN =
  "inline-flex items-center justify-center gap-1.5 border-[3px] border-on-background bg-primary-container px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-on-primary-container shadow-brutal transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

const DEFAULT_BTN = `${INSTALLED_TOOLBAR_BTN} bg-primary-container text-on-primary-container`;

export function AddProjectModal({
  onAdded,
  size = "default",
  className,
}: {
  onAdded?: () => void;
  size?: "default" | "compact";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  function handleAdded() {
    onAdded?.();
    setOpen(false);
  }

  const btnClass =
    className ?? (size === "compact" ? COMPACT_BTN : DEFAULT_BTN);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnClass}>
        <MaterialIcon
          name="create_new_folder"
          className={size === "compact" ? "!text-base" : undefined}
        />
        Add project
      </button>

      <BrutalModal open={open} onClose={() => setOpen(false)} title="Add a project folder">
        <AddProjectForm onAdded={handleAdded} onClose={() => setOpen(false)} />
      </BrutalModal>
    </>
  );
}

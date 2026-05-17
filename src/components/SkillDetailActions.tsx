"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function SkillDetailDeleteButton({
  skillPath,
  skillName,
}: {
  skillPath: string;
  skillName: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillPath }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      router.push("/installed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="flex w-full items-center justify-center gap-3 border-[3px] border-on-background bg-tertiary-container px-6 py-4 text-lg font-bold uppercase tracking-tight text-on-tertiary-container shadow-brutal transition-all hover:border-error hover:bg-error hover:text-on-error hover:shadow-brutal-error active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <MaterialIcon name="delete_forever" fill className="!text-3xl" />
        Delete skill
      </button>
      <p className="mt-4 text-center text-sm font-bold uppercase text-on-surface-variant">
        This cannot be undone.
      </p>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center border-[3px] border-on-background bg-on-background/30 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md border-[3px] border-on-background bg-background p-8 shadow-brutal-lg">
            <h4 className="text-xl font-bold uppercase tracking-tight text-primary">
              Remove “{skillName}”?
            </h4>
            <p className="mt-3 text-on-surface-variant">
              The skill folder will be deleted from your computer.
            </p>
            <p className="mt-3 break-all font-mono text-xs text-on-surface-variant">{skillPath}</p>
            {error && <p className="mt-2 text-sm font-bold uppercase text-error">{error}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setConfirmOpen(false);
                  setError(null);
                }}
                className="flex-1 border-[3px] border-on-background bg-surface px-4 py-3 font-bold uppercase text-on-background shadow-brutal transition-colors hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex flex-1 items-center justify-center gap-2 border-[3px] border-on-background bg-error px-4 py-3 font-bold uppercase text-on-error shadow-brutal transition-none disabled:opacity-50"
              >
                {deleting ? (
                  <MaterialIcon name="progress_activity" className="animate-spin" />
                ) : (
                  <MaterialIcon name="delete" />
                )}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

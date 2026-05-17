"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function AddProjectForm({
  onAdded,
  onClose,
}: {
  onAdded?: () => void;
  onClose?: () => void;
}) {
  const [path, setPath] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function browseFolder() {
    if (browsing) return;
    setError(null);
    const spinnerDelay = window.setTimeout(() => setBrowsing(true), 300);
    const abort = new AbortController();
    const abortTimer = window.setTimeout(() => abort.abort(), 125_000);
    try {
      const res = await fetch("/api/pick-folder", {
        method: "POST",
        signal: abort.signal,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not open folder picker. Paste the path instead.",
        );
        return;
      }
      if (data.cancelled) return;
      if (data.path) {
        setPath(data.path);
        if (!label.trim()) {
          const parts = data.path.replace(/\\/g, "/").split("/");
          const base = parts[parts.length - 1] || "";
          if (base) setLabel(base);
        }
      }
    } catch {
      setError("Could not open folder picker. Paste the path instead.");
    } finally {
      window.clearTimeout(spinnerDelay);
      window.clearTimeout(abortTimer);
      setBrowsing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: path.trim(),
          label: label.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not add project");
      setPath("");
      setLabel("");
      onAdded?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
      <p className="text-sm text-on-primary-fixed-variant">
        Browse to choose a project folder, or paste its path below.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="D:\Projects\my-app"
          className="min-w-0 flex-1 border-[3px] border-on-background bg-surface px-4 py-3 font-mono text-sm text-on-background shadow-inner outline-none placeholder:normal-case placeholder:text-on-surface-variant focus:border-secondary"
          required
          autoFocus
        />
        <button
          type="button"
          onClick={browseFolder}
          disabled={browsing || loading}
          className="inline-flex items-center justify-center gap-2 border-[3px] border-on-background bg-surface px-6 py-3 text-sm font-bold uppercase text-on-background shadow-brutal transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
        >
          <MaterialIcon
            name={browsing ? "progress_activity" : "folder_open"}
            className={browsing ? "animate-spin" : ""}
          />
          Browse
        </button>
      </div>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (optional)"
        className="w-full border-[3px] border-on-background bg-surface px-4 py-2 font-mono text-sm text-on-background outline-none focus:border-secondary"
      />

      {error && (
        <p className="border-2 border-error bg-error-container px-3 py-2 text-sm font-bold uppercase text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={loading || !path.trim()}
          className="border-[3px] border-on-background bg-secondary-container px-8 py-4 text-sm font-bold uppercase text-on-secondary-container shadow-brutal transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add project"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="border-[3px] border-on-background bg-surface px-6 py-4 text-sm font-bold uppercase text-on-background shadow-brutal transition-all hover:bg-surface-variant active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

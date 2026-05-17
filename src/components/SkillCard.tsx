"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { InstalledSkill } from "@/lib/scanner/skill-scanner";
import { AgentBadgeList } from "@/components/AgentIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { encodeSkillPathKey } from "@/lib/skills/skill-path-key";
import { InstallOriginBadge } from "@/components/InstallOriginBadge";
import { ReadMoreReveal } from "@/components/motion/ReadMoreReveal";

const SKILL_ICONS = [
  "auto_awesome",
  "psychology",
  "terminal",
  "code_blocks",
  "language",
  "memory",
] as const;

function iconForSkill(name: string) {
  let h = 0;
  for (const c of name) h = (h + c.charCodeAt(0)) % SKILL_ICONS.length;
  return SKILL_ICONS[h];
}

const DESC_PREVIEW_LINES = 3;

export function SkillCard({
  skill,
  onDeleted,
  enabledAgentIds = [],
}: {
  skill: InstalledSkill;
  onDeleted?: () => void;
  enabledAgentIds?: string[];
}) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descOpen, setDescOpen] = useState(false);
  const icon = iconForSkill(skill.parsed.name);
  const detailHref = `/installed/skill/${encodeSkillPathKey(skill.skillMdPath)}`;

  const hasUpdate = skill.gitUpdateStatus?.state === "update_available";

  const descNeedsToggle = useMemo(() => {
    const t = skill.parsed.description.trim();
    if (!t) return false;
    const lines = t.split(/\r?\n/).filter((line) => line.length > 0).length;
    return lines > DESC_PREVIEW_LINES || t.length > 72;
  }, [skill.parsed.description]);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillPath: skill.skillPath }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      setConfirmOpen(false);
      onDeleted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article
      className={`relative flex w-full min-h-[22rem] flex-col self-start border-[3px] border-on-background bg-surface-container-lowest shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-hover md:min-h-[24rem] ${
        hasUpdate ? "skill-update-available" : ""
      }`}
    >
      <div className="relative z-20 flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={detailHref}
            className="flex h-16 w-16 shrink-0 items-center justify-center border-[3px] border-on-background bg-tertiary-fixed shadow-brutal-sm transition-colors hover:bg-primary-container"
          >
            <MaterialIcon name={icon} fill className="!text-3xl text-tertiary" />
          </Link>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {hasUpdate && (
              <span
                className="border-[3px] border-secondary bg-secondary-container px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-on-secondary-container"
                title="Local git clone differs from origin — see skill detail"
              >
                Update
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="border-[3px] border-transparent bg-transparent p-2 text-on-surface-variant transition-colors hover:border-on-background hover:bg-error-container hover:text-error"
              aria-label={`Remove skill ${skill.parsed.name}`}
            >
              <MaterialIcon name="delete" className="!text-xl" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-shrink-0">
          <div className="mb-2 flex flex-wrap gap-2">
            <InstallOriginBadge origin={skill.installOrigin} />
          </div>
          <Link
            href={detailHref}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <h3 className="line-clamp-2 min-h-[3.25rem] text-xl font-bold uppercase text-on-background md:text-2xl">
              {skill.parsed.name}
            </h3>
          </Link>

          <div className="mt-2 flex flex-col gap-2">
            {descNeedsToggle ? (
              <button
                type="button"
                aria-expanded={descOpen}
                onClick={() => setDescOpen((v) => !v)}
                className="min-h-6 shrink-0 self-start border-2 border-transparent px-1 text-left text-xs font-bold uppercase text-primary underline decoration-2 underline-offset-2 hover:bg-primary-container/30"
              >
                {descOpen ? "Show less" : "Read more"}
              </button>
            ) : null}
            {descNeedsToggle ? (
              <>
                {!descOpen ? (
                  <p className="line-clamp-3 min-h-[4.5rem] whitespace-pre-wrap text-sm text-on-surface-variant md:text-base">
                    {skill.parsed.description}
                  </p>
                ) : null}
                <ReadMoreReveal show={descOpen}>
                  <div className="max-h-40 overflow-x-hidden overflow-y-auto whitespace-pre-wrap border-2 border-on-background/40 bg-surface-container-low/50 p-3 text-sm text-on-surface-variant shadow-brutal-faint md:text-base">
                    {skill.parsed.description}
                  </div>
                </ReadMoreReveal>
              </>
            ) : (
              <p className="line-clamp-3 min-h-[4.5rem] whitespace-pre-wrap text-sm text-on-surface-variant md:text-base">
                {skill.parsed.description}
              </p>
            )}
          </div>
        </div>

        <div className="min-h-[5.5rem] shrink-0">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Works with</p>
          <AgentBadgeList agentIds={skill.compatibleAgentIds} enabledAgentIds={enabledAgentIds} />
        </div>

        <div className="mt-auto space-y-1 border-t-[3px] border-on-background pt-4 font-mono text-xs text-on-surface-variant">
          <p className="flex items-center gap-2 text-on-background">
            <MaterialIcon name={skill.scope === "global" ? "public" : "folder"} className="!text-base" />
            <span className="font-bold uppercase tracking-tight">
              {skill.scope === "global" ? "All projects" : skill.rootLabel}
            </span>
          </p>
          <p className="truncate">{skill.skillsRootRelative}</p>
        </div>

        {skill.parsed.issues.length > 0 && (
          <ul className="text-xs font-bold uppercase text-error">
            {skill.parsed.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center border-[3px] border-transparent bg-on-background/30 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md border-[3px] border-on-background bg-surface-container-lowest p-8 shadow-brutal-lg">
            <h4 className="text-xl font-bold uppercase text-primary">Remove this skill?</h4>
            <p className="mt-3 text-on-surface-variant">
              <strong className="uppercase text-on-background">{skill.parsed.name}</strong> will be deleted from disk.
              This cannot be undone.
            </p>
            <p className="mt-2 break-all font-mono text-xs text-on-surface-variant">{skill.skillPath}</p>
            {error && <p className="mt-2 text-sm font-bold uppercase text-error">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setConfirmOpen(false);
                  setError(null);
                }}
                className="flex-1 border-[3px] border-on-background py-3 font-bold uppercase shadow-brutal transition-opacity hover:opacity-90"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex flex-1 items-center justify-center gap-2 border-[3px] border-on-background bg-error py-3 font-bold uppercase text-on-error shadow-brutal disabled:opacity-50"
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
    </article>
  );
}

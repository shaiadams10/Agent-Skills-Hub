"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SkillCard } from "@/components/SkillCard";
import { ExpandableRevealGrid } from "@/components/motion/ExpandableRevealGrid";
import { AddProjectModal } from "@/components/AddProjectModal";
import { CollapsibleSkillSection } from "@/components/CollapsibleSkillSection";
import {
  INSTALLED_TOOLBAR_BTN,
  INSTALLED_TOOLBAR_GRID,
} from "@/components/installed/installed-toolbar";
import {
  UnselectedAgentNotice,
  type UnselectedAgentGroup,
} from "@/components/installed/UnselectedAgentNotice";
import { ProjectLibraryCard } from "@/components/ProjectLibraryCard";
import { InfoTip } from "@/components/ui/InfoTip";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { InstalledSkill } from "@/lib/scanner/skill-scanner";

type UpdateCheckSummary = {
  checkedAt: string;
  gitSkillFolders: number;
  updateAvailableCount: number;
  errorsCount: number;
  cacheTtlHours: number;
  forced: boolean;
  skipped?: boolean;
};

type ScanResult = {
  global: InstalledSkill[];
  projects: { path: string; label: string; skills: InstalledSkill[] }[];
  scannedAt: string;
  enabledAgentIds?: string[];
  updateCheckSummary?: UpdateCheckSummary;
};

/**
 * Groups skills by the assistant our origin resolver attributes them to,
 * but only when that assistant is *not* in the user's Setup selection.
 *
 * Strict rules (compatibility is intentionally NOT considered):
 *   • Skill must have a detected installer (`installOrigin.kind === "agent"`
 *     with `installedByAgentId` set). Manual / unknown installs are excluded.
 *   • Confidence must be `declared`, `high`, or `medium` — low-confidence
 *     guesses are excluded so we don't nag the user about ambiguous cases.
 *   • The installer agent must not be in `enabledAgentIds`.
 *
 * If the user hasn't selected any assistants (empty list = "all"), the banner
 * is suppressed entirely.
 */
function groupUnselectedAgentSkills(
  data: ScanResult | null,
): UnselectedAgentGroup[] {
  if (!data) return [];
  const enabled = data.enabledAgentIds ?? [];
  if (enabled.length === 0) return [];

  const enabledSet = new Set(enabled);
  const allSkills = [
    ...data.global,
    ...data.projects.flatMap((p) => p.skills),
  ];

  const byAgent = new Map<string, InstalledSkill[]>();
  for (const skill of allSkills) {
    const origin = skill.installOrigin;
    if (origin.kind !== "agent") continue;
    if (!origin.installedByAgentId) continue;
    if (origin.confidence === "low") continue;
    if (enabledSet.has(origin.installedByAgentId)) continue;

    const list = byAgent.get(origin.installedByAgentId) ?? [];
    list.push(skill);
    byAgent.set(origin.installedByAgentId, list);
  }

  return [...byAgent.entries()]
    .map(([agentId, skills]) => ({ agentId, skills }))
    .sort((a, b) => b.skills.length - a.skills.length);
}

function ScanStatusLine({
  scannedAt,
  total,
  summary,
}: {
  scannedAt?: string;
  total: number;
  summary?: UpdateCheckSummary;
}) {
  const showGit = summary && !summary.skipped;
  if (!scannedAt && !showGit) return null;

  const hasUpdates = (summary?.updateAvailableCount ?? 0) > 0;

  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs leading-snug ${
        hasUpdates ? "font-bold uppercase text-on-secondary-container" : "text-on-surface-variant"
      }`}
    >
      {scannedAt && (
        <>
          <MaterialIcon name="schedule" className="!text-sm opacity-80" />
          <span>
            Last sync {new Date(scannedAt).toLocaleString()} · {total} skill{total === 1 ? "" : "s"}
          </span>
        </>
      )}
      {showGit && scannedAt && (
        <span className="text-on-surface-variant" aria-hidden>
          ·
        </span>
      )}
      {showGit && (
        <>
          <MaterialIcon name="commit" className="!text-sm opacity-80" />
          <span>
            Git{" "}
            {summary.forced ? "forced" : `cache ≤${summary.cacheTtlHours}h`} · {summary.gitSkillFolders}{" "}
            folder{summary.gitSkillFolders === 1 ? "" : "s"} · {summary.updateAvailableCount} update
            {summary.updateAvailableCount === 1 ? "" : "s"}
            {summary.errorsCount > 0
              ? ` · ${summary.errorsCount} error${summary.errorsCount === 1 ? "" : "s"}`
              : ""}
          </span>
        </>
      )}
    </p>
  );
}

export default function InstalledPage() {
  const [data, setData] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (forceGit = false) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.set("checkUpdates", "1");
      if (forceGit) qs.set("forceGit", "1");
      const res = await fetch(`/api/installed?${qs.toString()}`);
      if (!res.ok) throw new Error("Could not scan skills");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const total =
    (data?.global.length ?? 0) +
    (data?.projects.reduce((n, p) => n + p.skills.length, 0) ?? 0);

  const summary = data?.updateCheckSummary;

  const unselectedAgentGroups = useMemo(
    () => groupUnselectedAgentSkills(data),
    [data],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 p-6 md:p-10">
      <div className="grid gap-6 border-b-[3px] border-on-background pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold uppercase tracking-tight md:text-5xl">My installed skills</h1>
            <InfoTip label="What install source means">
              <strong className="font-bold uppercase text-on-background">Install source</strong> tells you whether
              <em> you</em> put the skill on disk or a coding-agent platform did.
              <br />
              <br />
              <strong>Installed By &lt;tool&gt;</strong> appears when:
              <br />
              1. <code className="font-mono text-xs">SKILL.md</code> declares{" "}
              <code className="font-mono text-xs">install_source: agent_tool</code> +{" "}
              <code className="font-mono text-xs">installed_by</code> (highest confidence), or
              <br />
              2. the skill folder lives inside a path the tool clearly owns — currently Codex&apos;s
              <code className="font-mono text-xs"> .codex/skills/.system/</code> (bundled templates), or your
              user-wide <code className="font-mono text-xs">~/.codex/skills/</code> (Codex&apos;s
              <code className="font-mono text-xs"> skill-installer</code> writes here).
              <br />
              <br />
              <strong>Manually Installed</strong> is the default for everything else — including skills you
              authored under <code className="font-mono text-xs">.cursor/skills</code>,{" "}
              <code className="font-mono text-xs">.agent/skills</code>, or project-scope{" "}
              <code className="font-mono text-xs">.codex/skills</code>. If a global Codex skill is actually
              your hand-placed copy, set <code className="font-mono text-xs">install_source: manual</code> in
              its SKILL.md to override.
            </InfoTip>
          </div>
          <p className="mt-2 w-full text-lg text-on-surface-variant">
            All SKILL.md installs on this PC and in project folders you watch.
          </p>
          {(data || (summary && !summary.skipped)) && (
            <div className="mt-3">
              <ScanStatusLine scannedAt={data?.scannedAt} total={total} summary={summary} />
            </div>
          )}
        </div>
        <div className={INSTALLED_TOOLBAR_GRID}>
          <button
            type="button"
            onClick={() => load(false)}
            disabled={loading}
            className={`${INSTALLED_TOOLBAR_BTN} bg-secondary-container text-on-secondary-container`}
          >
            <MaterialIcon name="refresh" className={loading ? "animate-spin" : ""} />
            Sync skills
          </button>
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading}
            title="Bypasses the 4h cache and re-fetches origin for every git skill folder"
            className={`${INSTALLED_TOOLBAR_BTN} bg-surface-container-lowest text-on-background hover:bg-primary-container`}
          >
            <MaterialIcon name="cloud_sync" />
            Re-check git
          </button>
          <AddProjectModal onAdded={() => load(false)} />
        </div>
      </div>

      {error && (
        <p className="border-[3px] border-error bg-error-container px-4 py-4 font-bold uppercase text-error">
          {error}
        </p>
      )}

      {loading && !data && (
        <p className="py-16 text-center font-bold uppercase text-on-surface-variant">
          Scanning skills and checking git remotes…
        </p>
      )}

      {data && unselectedAgentGroups.length > 0 && (
        <UnselectedAgentNotice groups={unselectedAgentGroups} />
      )}

      {data && (
        <>
          <CollapsibleSkillSection
            title="Global skills"
            badge={
              <span className="border-[3px] border-on-background bg-primary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-primary-fixed">
                System wide
              </span>
            }
          >
            {data.global.length === 0 ? (
              <EmptyHint message="No global skills yet. Try ~/.cursor/skills or ~/.agents/skills." />
            ) : (
              <ExpandableRevealGrid
                items={data.global}
                initialCount={3}
                getKey={(skill) => skill.id}
                renderItem={(skill) => (
                  <SkillCard skill={skill} onDeleted={() => load(false)} />
                )}
              />
            )}
          </CollapsibleSkillSection>

          <CollapsibleSkillSection
            title="Project libraries"
            badge={
              <span className="border-[3px] border-on-background bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
                Per folder
              </span>
            }
            titleExtra={<AddProjectModal size="compact" onAdded={() => load(false)} />}
          >
            {data.projects.length === 0 ? (
              <EmptyHint message="Click Add project to watch a repo and scan its skill folders." />
            ) : (
              <ExpandableRevealGrid
                items={data.projects}
                initialCount={3}
                getKey={(proj) => proj.path}
                showMoreLabel={(n) => `Show ${n} more libraries`}
                renderItem={(proj) => (
                  <ProjectLibraryCard
                    path={proj.path}
                    label={proj.label}
                    skillCount={proj.skills.length}
                  />
                )}
              />
            )}
          </CollapsibleSkillSection>
        </>
      )}
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <p className="border-[3px] border-dashed border-outline bg-surface-container-low px-8 py-10 text-center font-bold uppercase text-on-surface-variant">
      {message}
    </p>
  );
}

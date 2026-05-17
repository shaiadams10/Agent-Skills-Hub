"use client";

import { useCallback, useEffect, useState } from "react";
import { SkillCard } from "@/components/SkillCard";
import { SkillCardGrid } from "@/components/SkillCardGrid";
import { AddProjectModal } from "@/components/AddProjectModal";
import { CollapsibleSkillSection } from "@/components/CollapsibleSkillSection";
import {
  INSTALLED_TOOLBAR_BTN,
  INSTALLED_TOOLBAR_GRID,
} from "@/components/installed/installed-toolbar";
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
  updateCheckSummary?: UpdateCheckSummary;
};

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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 p-6 md:p-10">
      <div className="grid gap-6 border-b-[3px] border-on-background pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold uppercase tracking-tight md:text-5xl">My installed skills</h1>
            <InfoTip label="What install source means">
              <strong className="font-bold uppercase text-on-background">Install source</strong> is our best guess at
              who put each skill on disk.
              <br />
              <br />
              If <code className="font-mono text-xs">SKILL.md</code> includes{" "}
              <code className="font-mono text-xs">install_source</code> and{" "}
              <code className="font-mono text-xs">installed_by</code>, we show that.
              <br />
              <br />
              Otherwise we infer from the folder (e.g. under <code className="font-mono text-xs">.codex/skills</code> →
              Codex). <strong>Manually installed</strong> means you placed it outside those tool-specific layouts.
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
              <SkillCardGrid>
                {data.global.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} onDeleted={() => load(false)} />
                ))}
              </SkillCardGrid>
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.projects.map((proj) => (
                  <ProjectLibraryCard
                    key={proj.path}
                    path={proj.path}
                    label={proj.label}
                    skillCount={proj.skills.length}
                  />
                ))}
              </div>
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

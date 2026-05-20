"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AgentIcon } from "@/components/AgentIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getAgentName } from "@/lib/agents/registry";
import type { InstalledSkill } from "@/lib/scanner/skill-scanner";

export type UnselectedAgentGroup = {
  /** Agent ID our origin resolver attributed the install to. */
  agentId: string;
  /** Skills attributed to this installer that the user has not enabled. */
  skills: InstalledSkill[];
};

const COLLAPSED_STORAGE_KEY = "agent-skills-hub:unselected-notice-collapsed";

function readPersistedCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writePersistedCollapsed(collapsed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // localStorage can throw in private browsing — silently ignore.
  }
}

/**
 * Surfaces skills whose detected installer is an assistant the user has NOT
 * enabled on the Setup page. The notice is strictly origin-driven: it only
 * lists skills that our resolver attributes to a specific installer with at
 * least medium confidence. Compatibility metadata (which tools a skill claims
 * to work with) is intentionally ignored — having Cursor in `compatible_with`
 * is not evidence that Cursor put the skill on disk.
 */
export function UnselectedAgentNotice({
  groups,
}: {
  groups: UnselectedAgentGroup[];
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Hydrate the persisted state on mount (avoid SSR/CSR mismatch).
  useEffect(() => {
    setCollapsed(readPersistedCollapsed());
  }, []);

  const totalSkills = useMemo(
    () => groups.reduce((n, g) => n + g.skills.length, 0),
    [groups],
  );

  if (groups.length === 0) return null;

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      writePersistedCollapsed(next);
      return next;
    });
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className="border-[3px] border-on-background bg-secondary-container text-on-secondary-container shadow-brutal"
    >
      <header className="flex flex-wrap items-center gap-3 px-5 py-4">
        <MaterialIcon name="info" fill className="!text-2xl shrink-0" />
        <h2 className="flex-1 min-w-0 text-sm font-bold uppercase tracking-wide">
          Skills found from assistants you haven&apos;t selected{" "}
          <span className="text-on-surface-variant">({totalSkills})</span>
        </h2>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls="unselected-agent-notice-body"
          className="inline-flex items-center gap-1.5 border-[3px] border-on-background bg-surface-container-lowest px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-on-background shadow-brutal-sm transition-all hover:bg-primary-container active:translate-x-px active:translate-y-px active:shadow-none"
        >
          <MaterialIcon
            name={collapsed ? "expand_more" : "expand_less"}
            className="!text-base"
          />
          {collapsed ? "Expand" : "Minimize"}
        </button>
      </header>

      {!collapsed && (
        <div
          id="unselected-agent-notice-body"
          className="border-t-[3px] border-on-background/30 px-5 pb-4 pt-3"
        >
          <p className="text-sm">
            Our origin analysis attributes the skills below to an assistant that
            isn&apos;t enabled in your{" "}
            <Link
              href="/setup"
              className="font-bold underline decoration-2 underline-offset-2 hover:text-primary"
            >
              Setup preferences
            </Link>
            . They&apos;re still shown in the grid — this is just a heads-up
            about who put them on disk.
          </p>

          <ul className="mt-3 flex flex-col gap-3">
            {groups.map(({ agentId, skills }) => (
              <InstallerGroupRow
                key={agentId}
                agentId={agentId}
                skills={skills}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function InstallerGroupRow({
  agentId,
  skills,
}: {
  agentId: string;
  skills: InstalledSkill[];
}) {
  const name = getAgentName(agentId);
  return (
    <li className="border-2 border-on-background/70 bg-surface-container-lowest px-3 py-3 text-on-background">
      <div className="flex flex-wrap items-center gap-2">
        <AgentIcon agentId={agentId} size={18} />
        <span className="text-xs font-bold uppercase tracking-wide">
          Installed by {name}
        </span>
        <span className="text-xs text-on-surface-variant">·</span>
        <span className="text-xs text-on-surface-variant">
          {skills.length} skill{skills.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className="mt-2 flex flex-col gap-1 pl-6 text-sm">
        {skills.map((s) => (
          <li key={s.id} className="flex items-baseline gap-2">
            <span className="font-mono font-bold">{s.parsed.name}</span>
            <span className="truncate font-mono text-xs text-on-surface-variant">
              {s.skillsRootRelative}
            </span>
          </li>
        ))}
      </ul>
    </li>
  );
}

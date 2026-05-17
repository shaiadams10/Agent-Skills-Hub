"use client";

import { useState } from "react";
import { displayCompatibleAgentIds } from "@/lib/agents/filter-display-agents";
import { getAgentById } from "@/lib/agents/registry";

export function AgentIcon({
  agentId,
  size = 20,
  className = "",
}: {
  agentId: string;
  size?: number;
  className?: string;
}) {
  const agent = getAgentById(agentId);
  const label = agent?.name ?? agentId;
  const [failed, setFailed] = useState(false);

  if (agent?.iconFile && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/icons/agents/${agent.iconFile}`}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded-none ${className}`}
        aria-hidden
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border-[3px] border-on-background bg-secondary-fixed font-bold uppercase text-secondary shadow-brutal ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {label.charAt(0)}
    </span>
  );
}

export function AgentBadge({ agentId }: { agentId: string }) {
  const agent = getAgentById(agentId);
  const name = agent?.name ?? agentId;

  return (
    <span className="inline-flex items-center gap-1.5 border-[3px] border-on-background bg-surface-container-low px-2.5 py-1 text-xs font-bold uppercase text-on-surface shadow-brutal">
      <AgentIcon agentId={agentId} size={16} />
      <span>{name}</span>
    </span>
  );
}

const DEFAULT_MAX_VISIBLE = 4;

export function AgentBadgeList({
  agentIds,
  enabledAgentIds = [],
  maxVisibleWhenUnfiltered = DEFAULT_MAX_VISIBLE,
}: {
  agentIds: string[];
  enabledAgentIds?: string[];
  maxVisibleWhenUnfiltered?: number;
}) {
  const displayIds = displayCompatibleAgentIds(agentIds, enabledAgentIds);
  if (displayIds.length === 0) return null;

  const useOverflow = enabledAgentIds.length === 0 && displayIds.length > maxVisibleWhenUnfiltered;
  const visibleIds = useOverflow ? displayIds.slice(0, maxVisibleWhenUnfiltered) : displayIds;
  const overflowIds = useOverflow ? displayIds.slice(maxVisibleWhenUnfiltered) : [];

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="list" aria-label="Works with">
      {visibleIds.map((id) => (
        <span key={id} role="listitem">
          <AgentBadge agentId={id} />
        </span>
      ))}
      {overflowIds.length > 0 && <OverflowAgentBadges agentIds={overflowIds} />}
    </div>
  );
}

function OverflowAgentBadges({ agentIds }: { agentIds: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex" role="listitem">
      <button
        type="button"
        aria-label={`${agentIds.length} more compatible tools`}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-8 min-w-8 items-center justify-center border-[3px] border-on-background bg-surface-container-high px-2 text-xs font-bold uppercase text-on-surface shadow-brutal"
      >
        ···
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-50 mb-2 flex max-w-[14rem] flex-col gap-1.5 border-[3px] border-on-background bg-surface-container-lowest p-3 shadow-brutal"
        >
          {agentIds.map((id) => (
            <AgentBadge key={id} agentId={id} />
          ))}
        </span>
      )}
    </span>
  );
}

"use client";

import { useState } from "react";
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

export function AgentBadgeList({ agentIds }: { agentIds: string[] }) {
  if (agentIds.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Works with">
      {agentIds.map((id) => (
        <span key={id} role="listitem">
          <AgentBadge agentId={id} />
        </span>
      ))}
    </div>
  );
}

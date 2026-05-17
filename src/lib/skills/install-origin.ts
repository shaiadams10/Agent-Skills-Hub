import path from "path";
import { getAgentName } from "@/lib/agents/registry";
import type { ParsedSkill } from "@/lib/scanner/parse-skill";

export type InstallOriginKind = "manual" | "agent" | "unknown";

export type InstallConfidence = "declared" | "high" | "medium" | "low";

/**
 * Provenance for a skill folder. "agent" = we attribute installation/provisioning to a specific tool (best-effort).
 */
export type InstallOrigin = {
  kind: InstallOriginKind;
  /** Short label for chips, e.g. "Manually Installed" | "Installed By OpenAI Codex" */
  summary: string;
  detail: string;
  source: "declared" | "heuristic";
  installedByAgentId?: string;
  confidence: InstallConfidence;
};

/** Codex/OpenAI documented template dirs under .codex/skills (see openai/skills, Codex docs). */
const CODEX_TEMPLATE_DIRS = new Set([
  "skill-creator",
  "update-codex-instructions",
]);

function normRel(p: string): string {
  return p.replace(/\\/g, "/").toLowerCase();
}

function pathContainsDotSystem(absPath: string): boolean {
  const norm = absPath.replace(/\\/g, "/").toLowerCase();
  return norm.includes("/.system/") || norm.endsWith("/.system");
}

/** Single-primary-tool skill roots (first match wins). Shared dirs like `.agents/skills` are excluded. */
const EXCLUSIVE_ROOT_RULES: {
  test: (relNorm: string) => boolean;
  agentId: string;
  rationale: string;
}[] = [
  {
    test: (r) => r.includes(".github/skills"),
    agentId: "copilot",
    rationale:
      "GitHub documents agent skills under `.github/skills` for Copilot (see about-agent-skills).",
  },
  {
    test: (r) => r.includes(".copilot/skills"),
    agentId: "copilot",
    rationale: "Microsoft documents global Copilot skills under `~/.copilot/skills`.",
  },
  {
    test: (r) => r.includes(".codex/skills"),
    agentId: "codex",
    rationale:
      "OpenAI documents Codex skills under `.codex/skills` and ships templates under `.system` (see codex/skills).",
  },
  {
    test: (r) => r.includes(".gemini/skills"),
    agentId: "gemini-cli",
    rationale: "Gemini CLI docs use `.gemini/skills` for user skills.",
  },
  {
    test: (r) => r.includes(".windsurf/skills"),
    agentId: "windsurf",
    rationale: "Windsurf docs reference `.windsurf/skills`.",
  },
  {
    test: (r) => r.includes(".codeium/windsurf/skills"),
    agentId: "windsurf",
    rationale: "Windsurf global skills path under Codeium user config.",
  },
  {
    test: (r) => r.includes(".kilo/skills"),
    agentId: "kilo",
    rationale: "Kilo Code documents `.kilo/skills`.",
  },
  {
    test: (r) => r.includes(".hermes/skills"),
    agentId: "hermes",
    rationale: "Hermes documents `~/.hermes/skills`.",
  },
  {
    test: (r) => r.includes(".agent/skills"),
    agentId: "antigravity",
    rationale: "Antigravity docs use `.agent/skills` in projects.",
  },
  {
    test: (r) => r.includes(".opencode/skills") || r.includes(".config/opencode/skills"),
    agentId: "opencode",
    rationale: "OpenCode docs use `.opencode/skills` (project) or `~/.config/opencode/skills` (global).",
  },
  {
    test: (r) => r.includes(".cursor/skills"),
    agentId: "cursor",
    rationale:
      "Cursor documents project skill folders under `.cursor/skills`. Skills here are *usually* user- or team-authored; we only mark tool-provisioned when other strong signals match.",
  },
];

function installedBySummary(agentId: string): string {
  return `Installed By ${getAgentName(agentId)}`;
}

function manualOrigin(detail: string): InstallOrigin {
  return {
    kind: "manual",
    summary: "Manually Installed",
    detail,
    source: "declared",
    confidence: "declared",
  };
}

function agentOrigin(
  agentId: string,
  detail: string,
  source: "declared" | "heuristic",
  confidence: InstallConfidence,
): InstallOrigin {
  return {
    kind: "agent",
    summary: installedBySummary(agentId),
    detail,
    source,
    installedByAgentId: agentId,
    confidence,
  };
}

export function resolveInstallOrigin(opts: {
  skillPath: string;
  skillDirName: string;
  skillsRootRelative: string;
  compatibleAgentIds: string[];
  parsed: ParsedSkill;
}): InstallOrigin {
  const declared = opts.parsed.installSource;
  const explicitAgent = opts.parsed.installedByAgentId;

  if (declared === "manual") {
    return manualOrigin(
      "Declared in SKILL.md (install_source: manual).",
    );
  }

  if (declared === "agent_tool") {
    if (explicitAgent) {
      return agentOrigin(
        explicitAgent,
        `Declared in SKILL.md (install_source: agent_tool, installed_by: ${explicitAgent}).`,
        "declared",
        "declared",
      );
    }
    const fromPath = inferExclusiveProvisionAgent(opts.skillsRootRelative);
    if (fromPath && fromPath.agentId !== "cursor") {
      return agentOrigin(
        fromPath.agentId,
        `Declared as agent/tool install; attributed to ${getAgentName(fromPath.agentId)} from canonical skill path (${fromPath.rationale})`,
        "declared",
        "medium",
      );
    }
    return {
      kind: "agent",
      summary: "Installed By coding agent",
      detail:
        "Declared in SKILL.md (install_source: agent_tool) without installed_by. Add installed_by: <agent id> (e.g. codex, cursor) for a precise label.",
      source: "declared",
      confidence: "low",
    };
  }

  if (declared === "unknown") {
    return {
      kind: "unknown",
      summary: "Unknown origin",
      detail: "Declared in SKILL.md (install_source: unknown).",
      source: "declared",
      confidence: "declared",
    };
  }

  const absPath = path.resolve(opts.skillPath);
  const folder = opts.skillDirName.toLowerCase();
  const relNorm = normRel(opts.skillsRootRelative);
  const inCodexTree = relNorm.includes(".codex/skills");

  if (pathContainsDotSystem(absPath) && inCodexTree) {
    return agentOrigin(
      "codex",
      "Located under `.codex/skills/**/.system/**`, matching OpenAI’s documented layout for Codex / skill-creator templates.",
      "heuristic",
      "high",
    );
  }

  if (inCodexTree && CODEX_TEMPLATE_DIRS.has(folder)) {
    const hasCodex = opts.compatibleAgentIds.includes("codex");
    return agentOrigin(
      "codex",
      hasCodex
        ? `Folder “${opts.skillDirName}” under .codex/skills matches documented Codex CLI helper / template skill names.`
        : `Folder “${opts.skillDirName}” under .codex/skills matches known Codex template names (Codex not in compatible agents list for this path — verify).`,
      "heuristic",
      hasCodex ? "high" : "medium",
    );
  }

  const exclusive = inferExclusiveProvisionAgent(opts.skillsRootRelative);
  if (exclusive?.agentId === "cursor" && relNorm.includes(".cursor/skills") && !pathContainsDotSystem(absPath)) {
    return {
      kind: "unknown",
      summary: "Unknown origin",
      detail:
        "Under `.cursor/skills`, Cursor treats this as user or repo-managed content; we cannot tell manual vs generated without SKILL.md hints. Use install_source / installed_by to label it.",
      source: "heuristic",
      confidence: "low",
    };
  }

  if (exclusive && exclusive.agentId !== "cursor") {
    return agentOrigin(
      exclusive.agentId,
      `Under ${opts.skillsRootRelative}: ${exclusive.rationale} Typical installs land here via that tool’s workflow or docs; could still be a manual clone.`,
      "heuristic",
      "medium",
    );
  }

  if (relNorm.includes(".agents/skills")) {
    return {
      kind: "unknown",
      summary: "Unknown origin",
      detail:
        "`.agents/skills` is shared by several assistants. Add `install_source` and `installed_by` to SKILL.md to record provenance.",
      source: "heuristic",
      confidence: "low",
    };
  }

  if (relNorm.includes(".claude/skills")) {
    return {
      kind: "unknown",
      summary: "Unknown origin",
      detail:
        "Claude / IDE-compatible skills live here for multiple tools; we don’t infer the installer without frontmatter or `.system`-style markers.",
      source: "heuristic",
      confidence: "low",
    };
  }

  return {
    kind: "unknown",
    summary: "Unknown origin",
    detail:
      "No strong signal. In SKILL.md frontmatter set install_source: manual | agent_tool | unknown, and for agent_tool optionally installed_by: codex | cursor | copilot | …",
    source: "heuristic",
    confidence: "low",
  };
}

function inferExclusiveProvisionAgent(skillsRootRelative: string):
  | { agentId: string; rationale: string }
  | undefined {
  const relNorm = normRel(skillsRootRelative);
  for (const rule of EXCLUSIVE_ROOT_RULES) {
    if (rule.test(relNorm)) {
      return { agentId: rule.agentId, rationale: rule.rationale };
    }
  }
  return undefined;
}

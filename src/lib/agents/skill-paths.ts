import type { SkillScope } from "@/lib/agents/registry";

/**
 * Canonical skill directory paths verified against official documentation.
 * @see docs/SCAN_PATHS.md in repo for source links per path.
 */
export type CanonicalSkillPath = {
  /** Stable key, e.g. "global-cursor-skills" */
  id: string;
  scope: SkillScope;
  /** Relative to project root or user home */
  relativePath: string;
  /** Agent IDs that load skills from this path per official docs */
  agentIds: string[];
  /** Walk subfolders for nested SKILL.md (e.g. Cursor, Claude monorepos) */
  recursive: boolean;
  docUrl: string;
};

export const CANONICAL_SKILL_PATHS: CanonicalSkillPath[] = [
  // --- Cursor (https://cursor.com/docs/context/skills) ---
  {
    id: "project-cursor-skills",
    scope: "project",
    relativePath: ".cursor/skills",
    agentIds: ["cursor"],
    recursive: true,
    docUrl: "https://cursor.com/docs/context/skills",
  },
  {
    id: "project-agents-skills",
    scope: "project",
    relativePath: ".agents/skills",
    agentIds: ["cursor", "copilot", "gemini-cli", "antigravity", "kilo"],
    recursive: true,
    docUrl: "https://cursor.com/docs/context/skills",
  },
  {
    id: "global-cursor-skills",
    scope: "global",
    relativePath: ".cursor/skills",
    agentIds: ["cursor"],
    recursive: true,
    docUrl: "https://cursor.com/docs/context/skills",
  },
  {
    id: "global-agents-skills",
    scope: "global",
    relativePath: ".agents/skills",
    agentIds: ["cursor", "copilot", "gemini-cli", "antigravity", "kilo"],
    recursive: true,
    docUrl: "https://cursor.com/docs/context/skills",
  },
  // Cursor compatibility dirs (same doc)
  {
    id: "project-claude-skills-cursor-compat",
    scope: "project",
    relativePath: ".claude/skills",
    agentIds: ["cursor", "claude-code", "copilot", "kilo"],
    recursive: true,
    docUrl: "https://cursor.com/docs/context/skills",
  },
  {
    id: "project-codex-skills-cursor-compat",
    scope: "project",
    relativePath: ".codex/skills",
    agentIds: ["cursor", "codex"],
    recursive: true,
    docUrl: "https://cursor.com/docs/context/skills",
  },
  {
    id: "global-claude-skills",
    scope: "global",
    relativePath: ".claude/skills",
    agentIds: ["cursor", "claude-code", "copilot", "kilo"],
    recursive: true,
    docUrl: "https://code.claude.com/docs/en/skills",
  },
  {
    id: "global-codex-skills",
    scope: "global",
    relativePath: ".codex/skills",
    agentIds: ["cursor", "codex"],
    recursive: true,
    docUrl: "https://developers.openai.com/codex/skills/",
  },
  // --- Claude Code ---
  {
    id: "project-claude-skills",
    scope: "project",
    relativePath: ".claude/skills",
    agentIds: ["claude-code", "copilot", "kilo"],
    recursive: true,
    docUrl: "https://code.claude.com/docs/en/skills",
  },
  // --- GitHub Copilot ---
  {
    id: "project-github-skills",
    scope: "project",
    relativePath: ".github/skills",
    agentIds: ["copilot"],
    recursive: false,
    docUrl:
      "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills",
  },
  {
    id: "global-copilot-skills",
    scope: "global",
    relativePath: ".copilot/skills",
    agentIds: ["copilot"],
    recursive: false,
    docUrl:
      "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills",
  },
  // --- Codex ---
  {
    id: "project-codex-skills",
    scope: "project",
    relativePath: ".codex/skills",
    agentIds: ["codex", "cursor"],
    recursive: false,
    docUrl: "https://developers.openai.com/codex/skills/",
  },
  // --- Gemini CLI ---
  {
    id: "project-gemini-skills",
    scope: "project",
    relativePath: ".gemini/skills",
    agentIds: ["gemini-cli", "antigravity"],
    recursive: false,
    docUrl: "https://geminicli.com/docs/cli/skills/",
  },
  {
    id: "global-gemini-skills",
    scope: "global",
    relativePath: ".gemini/skills",
    agentIds: ["gemini-cli", "antigravity"],
    recursive: false,
    docUrl: "https://geminicli.com/docs/cli/skills/",
  },
  // --- Antigravity IDE global skill roots (under ~/.gemini/) ---
  // Antigravity ships as a fork of Gemini CLI and writes skills into several
  // subfolders of ~/.gemini/. We've observed all four in the wild on the same
  // install — the IDE rotates between them across versions / sessions.
  {
    id: "global-antigravity-skills",
    scope: "global",
    relativePath: ".gemini/antigravity/skills",
    agentIds: ["antigravity"],
    recursive: false,
    docUrl: "https://antigravity.codes/blog/antigravity-skills-setup-guide",
  },
  {
    id: "global-antigravity-ide-skills",
    scope: "global",
    relativePath: ".gemini/antigravity-ide/skills",
    agentIds: ["antigravity"],
    recursive: false,
    docUrl:
      "https://codelabs.developers.google.com/getting-started-with-antigravity-skills",
  },
  {
    id: "global-antigravity-backup-skills",
    scope: "global",
    relativePath: ".gemini/antigravity-backup/skills",
    agentIds: ["antigravity"],
    recursive: false,
    docUrl:
      "https://codelabs.developers.google.com/getting-started-with-antigravity-skills",
  },
  {
    id: "global-antigravity-config-skills",
    scope: "global",
    relativePath: ".gemini/config/skills",
    agentIds: ["antigravity"],
    recursive: false,
    docUrl:
      "https://codelabs.developers.google.com/getting-started-with-antigravity-skills",
  },
  // --- Windsurf ---
  {
    id: "project-windsurf-skills",
    scope: "project",
    relativePath: ".windsurf/skills",
    agentIds: ["windsurf"],
    recursive: false,
    docUrl: "https://docs.windsurf.com/windsurf/cascade/skills",
  },
  {
    id: "global-windsurf-skills",
    scope: "global",
    relativePath: ".codeium/windsurf/skills",
    agentIds: ["windsurf"],
    recursive: false,
    docUrl: "https://docs.windsurf.com/windsurf/cascade/skills",
  },
  // --- Kilo Code ---
  {
    id: "project-kilo-skills",
    scope: "project",
    relativePath: ".kilo/skills",
    agentIds: ["kilo"],
    recursive: false,
    docUrl: "https://kilocode.ai/docs/customize/skills",
  },
  {
    id: "global-kilo-skills",
    scope: "global",
    relativePath: ".kilo/skills",
    agentIds: ["kilo"],
    recursive: false,
    docUrl: "https://kilocode.ai/docs/customize/skills",
  },
  // --- Hermes ---
  {
    id: "global-hermes-skills",
    scope: "global",
    relativePath: ".hermes/skills",
    agentIds: ["hermes"],
    recursive: false,
    docUrl:
      "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills",
  },
  // --- Antigravity ---
  {
    id: "project-agent-skills",
    scope: "project",
    relativePath: ".agent/skills",
    agentIds: ["antigravity"],
    recursive: false,
    docUrl:
      "https://codelabs.developers.google.com/getting-started-with-antigravity-skills",
  },
  // --- OpenCode ---
  {
    id: "project-opencode-skills",
    scope: "project",
    relativePath: ".opencode/skills",
    agentIds: ["opencode"],
    recursive: false,
    docUrl: "https://opencode.ai/docs/skills/",
  },
  {
    id: "global-opencode-skills",
    scope: "global",
    relativePath: ".config/opencode/skills",
    agentIds: ["opencode"],
    recursive: false,
    docUrl: "https://opencode.ai/docs/skills/",
  },
];

/** Relative skill folder paths documented for an agent at a given scope. */
export function getRelativePathsForAgent(
  agentId: string,
  scope: SkillScope,
): string[] {
  const rel = CANONICAL_SKILL_PATHS.filter(
    (p) => p.scope === scope && p.agentIds.includes(agentId),
  ).map((p) => p.relativePath);
  return [...new Set(rel)].sort();
}

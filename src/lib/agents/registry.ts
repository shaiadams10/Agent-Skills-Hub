export type SkillScope = "project" | "global";

export type AgentDefinition = {
  id: string;
  name: string;
  /** SVG filename under /public/icons/agents/ */
  iconFile: string;
  docsUrl: string;
};

/** Display metadata for coding tools (scan paths live in skill-paths.ts). */
export const AGENT_REGISTRY: AgentDefinition[] = [
  { id: "cursor", name: "Cursor", iconFile: "cursor.svg", docsUrl: "https://cursor.com/docs/context/skills" },
  { id: "claude-code", name: "Claude Code", iconFile: "claude-code.svg", docsUrl: "https://code.claude.com/docs/en/skills" },
  { id: "copilot", name: "GitHub Copilot", iconFile: "copilot.svg", docsUrl: "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills" },
  { id: "codex", name: "OpenAI Codex", iconFile: "codex.svg", docsUrl: "https://developers.openai.com/codex/skills/" },
  { id: "gemini-cli", name: "Gemini CLI", iconFile: "gemini-cli.svg", docsUrl: "https://geminicli.com/docs/cli/skills/" },
  { id: "windsurf", name: "Windsurf", iconFile: "windsurf.svg", docsUrl: "https://docs.windsurf.com/windsurf/cascade/skills" },
  { id: "kilo", name: "Kilo Code", iconFile: "kilo.svg", docsUrl: "https://kilocode.ai/docs/customize/skills" },
  { id: "hermes", name: "Hermes Agent", iconFile: "hermes.svg", docsUrl: "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills" },
  { id: "antigravity", name: "Google Antigravity", iconFile: "antigravity.svg", docsUrl: "https://codelabs.developers.google.com/getting-started-with-antigravity-skills" },
  { id: "opencode", name: "OpenCode", iconFile: "opencode.svg", docsUrl: "https://opencode.ai/docs/skills/" },
];

/** Coding assistants shown on Setup. */
export const SETUP_AGENT_REGISTRY = AGENT_REGISTRY;

const byId = new Map(AGENT_REGISTRY.map((a) => [a.id, a]));

export const KNOWN_AGENT_IDS = new Set(AGENT_REGISTRY.map((a) => a.id));

export function getAgentById(id: string): AgentDefinition | undefined {
  return byId.get(id);
}

export function getAgentName(id: string): string {
  return getAgentById(id)?.name ?? id;
}

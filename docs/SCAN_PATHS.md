# Skill scan paths (documentation sources)

Paths in `src/lib/agents/skill-paths.ts` are aligned with official docs. Re-verify when vendors update documentation.

| Relative path | Scope | Tools | Doc |
|---------------|-------|-------|-----|
| `.cursor/skills` | project, global | Cursor | [Cursor skills](https://cursor.com/docs/context/skills) |
| `.agents/skills` | project, global | Cursor, Copilot, Gemini CLI, Antigravity, Kilo | [Cursor skills](https://cursor.com/docs/context/skills) |
| `.claude/skills` | project, global | Claude Code, Cursor compat, Copilot, Kilo | [Claude Code skills](https://code.claude.com/docs/en/skills) |
| `.codex/skills` | project, global | Codex, Cursor compat | [Codex skills](https://developers.openai.com/codex/skills/) |
| `.github/skills` | project | GitHub Copilot | [Copilot agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| `.copilot/skills` | global | GitHub Copilot | same |
| `.gemini/skills` | project, global | Gemini CLI, Antigravity | [Gemini CLI skills](https://geminicli.com/docs/cli/skills/) |
| `.gemini/antigravity/skills` | global | Antigravity (Google) | [Antigravity skills setup](https://antigravity.codes/blog/antigravity-skills-setup-guide) |
| `.gemini/antigravity-ide/skills` | global | Antigravity (Google) | [Antigravity codelab](https://codelabs.developers.google.com/getting-started-with-antigravity-skills) |
| `.gemini/antigravity-backup/skills` | global | Antigravity (Google) | observed: IDE rotates skills between active / backup folders |
| `.gemini/config/skills` | global | Antigravity (Google) | observed: IDE config-managed copy of installed skills |
| `.windsurf/skills` | project | Windsurf | [Windsurf Cascade skills](https://docs.windsurf.com/windsurf/cascade/skills) |
| `.codeium/windsurf/skills` | global | Windsurf | same |
| `.kilo/skills` | project, global | Kilo Code | [Kilo skills](https://kilocode.ai/docs/customize/skills) |
| `.hermes/skills` | global | Hermes Agent | [Hermes skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) |
| `.agent/skills` | project | Antigravity | [Antigravity codelab](https://codelabs.developers.google.com/getting-started-with-antigravity-skills) |
| `.opencode/skills` | project | OpenCode | [OpenCode skills](https://opencode.ai/docs/skills/) |
| `.config/opencode/skills` | global | OpenCode | same |

**Recursive scan:** Enabled for `.cursor/skills`, `.agents/skills`, `.claude/skills`, `.codex/skills` per Cursor/Claude nested skill documentation.

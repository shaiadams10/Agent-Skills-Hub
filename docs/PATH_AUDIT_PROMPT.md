# Scan path audit prompt (copy for your AI agent)

Use this when you want an agent to **re-verify** that Agent Skills Hub still scans the correct skill folders for every supported coding assistant. The prompt includes repo file paths, the current canonical path registry, and **official documentation URLs** — no need to paste doc pages manually.

**Repository:** https://github.com/shaiadams10/AgentSkillsHub

---

## Short prompt

```
Audit Agent Skills Hub skill scan paths against official vendor documentation.

Repo: https://github.com/shaiadams10/AgentSkillsHub (clone or use the open workspace).

1. Read the canonical registry: src/lib/agents/skill-paths.ts (CANONICAL_SKILL_PATHS) and docs/SCAN_PATHS.md.
2. Read install-origin managed paths: src/lib/skills/install-origin.ts (AGENT_PROVISIONING_SIGNALS).
3. For EACH supported assistant below, open its official docs URL (fetch/read the live page), extract documented global and project skill directory paths, and compare to our registry.
4. Produce a markdown report: matches, missing paths we should add, paths we should remove or mark deprecated, recursive-scan corrections, and doc URL updates. Propose concrete edits to skill-paths.ts and SCAN_PATHS.md if anything changed.

Do not change unrelated code. If updates are needed, implement them and update AGENTS.md.
```

---

## Full prompt (recommended)

Copy everything inside the fence below.

```
You are auditing skill **scan paths** for Agent Skills Hub — a local Next.js app that discovers SKILL.md files under known directories on the user's machine (global = user home, project = watched repo roots).

Repository: https://github.com/shaiadams10/AgentSkillsHub

## Your task

Compare our **in-repo path configuration** to **current official documentation** for every coding assistant we support. Identify drift (new paths, renamed paths, deprecated paths, wrong scope, wrong recursive flag).

## Files you MUST read in the repo first

| File | Purpose |
|------|---------|
| `src/lib/agents/skill-paths.ts` | Source of truth: `CANONICAL_SKILL_PATHS` — every folder we scan |
| `src/lib/agents/registry.ts` | Supported assistant IDs and primary `docsUrl` per tool |
| `docs/SCAN_PATHS.md` | Human-readable path table + doc links |
| `src/lib/skills/install-origin.ts` | Managed-global / bundled paths used to label “installed by X” (not the full scan list) |
| `src/lib/agents/merged-paths.ts` | How duplicate relative paths are merged at scan time |
| `AGENTS.md` | Project behavior notes |

Scan behavior: **all** entries in `CANONICAL_SKILL_PATHS` are scanned on every refresh, regardless of user Setup. Setup only affects UI filtering.

## Supported assistants — official documentation to check

For each assistant, read the live documentation at these URLs (and follow links to path/location sections). Extract explicit directory paths (e.g. `.cursor/skills`, `~/.codex/skills`).

| ID | Display name | Primary docs URL |
|----|--------------|------------------|
| `cursor` | Cursor | https://cursor.com/docs/context/skills |
| `claude-code` | Claude Code | https://code.claude.com/docs/en/skills |
| `copilot` | GitHub Copilot | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills |
| `codex` | OpenAI Codex | https://developers.openai.com/codex/skills/ |
| `gemini-cli` | Gemini CLI | https://geminicli.com/docs/cli/skills/ |
| `windsurf` | Windsurf | https://docs.windsurf.com/windsurf/cascade/skills |
| `kilo` | Kilo Code | https://kilocode.ai/docs/customize/skills |
| `hermes` | Hermes Agent | https://hermes-agent.nousresearch.com/docs/user-guide/features/skills |
| `antigravity` | Google Antigravity | https://codelabs.developers.google.com/getting-started-with-antigravity-skills |
| `opencode` | OpenCode | https://opencode.ai/docs/skills/ |

**Antigravity supplementary sources** (IDE uses multiple `~/.gemini/` subfolders; verify against docs + release notes):
- https://antigravity.codes/blog/antigravity-skills-setup-guide

**Codex supplementary** (system/bundled skills):
- https://github.com/openai/skills (bundled under `.codex/skills/.system/` per our install-origin)

## Current canonical scan registry (baseline — verify against docs)

This is what the repo scans **today**. Confirm each row against official docs.

| Relative path | Scope(s) | Agent IDs | Recursive | Doc URL in repo |
|---------------|----------|-----------|-----------|-----------------|
| `.cursor/skills` | project, global | cursor | yes | https://cursor.com/docs/context/skills |
| `.agents/skills` | project, global | cursor, copilot, gemini-cli, antigravity, kilo | yes | https://cursor.com/docs/context/skills |
| `.claude/skills` | project, global | claude-code, cursor, copilot, kilo (varies by entry) | yes | https://code.claude.com/docs/en/skills / Cursor compat |
| `.codex/skills` | project, global | codex, cursor | yes (global) / no (project entry) | https://developers.openai.com/codex/skills/ |
| `.github/skills` | project | copilot | no | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills |
| `.copilot/skills` | global | copilot | no | same |
| `.gemini/skills` | project, global | gemini-cli, antigravity | no | https://geminicli.com/docs/cli/skills/ |
| `.gemini/antigravity/skills` | global | antigravity | no | https://antigravity.codes/blog/antigravity-skills-setup-guide |
| `.gemini/antigravity-ide/skills` | global | antigravity | no | Antigravity codelab |
| `.gemini/antigravity-backup/skills` | global | antigravity | no | observed — confirm if still used |
| `.gemini/config/skills` | global | antigravity | no | observed — confirm if still used |
| `.windsurf/skills` | project | windsurf | no | https://docs.windsurf.com/windsurf/cascade/skills |
| `.codeium/windsurf/skills` | global | windsurf | no | same |
| `.kilo/skills` | project, global | kilo | no | https://kilocode.ai/docs/customize/skills |
| `.hermes/skills` | global | hermes | no | https://hermes-agent.nousresearch.com/docs/user-guide/features/skills |
| `.agent/skills` | project | antigravity | no | Antigravity codelab |
| `.opencode/skills` | project | opencode | no | https://opencode.ai/docs/skills/ |
| `.config/opencode/skills` | global | opencode | no | same |

## Managed-global paths (install-origin only)

These are used to infer “Installed by &lt;tool&gt;” for **global** skills, not necessarily the full scan list:

| Agent ID | Managed-global relative paths (under user home) |
|----------|--------------------------------------------------|
| `codex` | `.codex/skills` (excludes `.codex/skills/.system/**` — bundled tier) |
| `antigravity` | `.gemini/antigravity/skills`, `.gemini/antigravity-ide/skills`, `.gemini/antigravity-backup/skills`, `.gemini/config/skills` |
| `gemini-cli` | `.gemini/skills` |

Verify these still match each tool’s installer documentation.

## What to deliver

1. **Per-assistant summary** — doc says X, we scan Y, status: OK / ADD / REMOVE / UPDATE.
2. **Gap table** — paths in docs but missing from `CANONICAL_SKILL_PATHS`.
3. **Stale table** — paths we scan that docs no longer mention (note if “observed in the wild” is still justified).
4. **Recursive scan** — confirm which paths should use nested `SKILL.md` walks.
5. **Recommended code changes** — exact edits to `skill-paths.ts`, `install-origin.ts`, `SCAN_PATHS.md`, and `AGENTS.md` if needed.

If documentation is ambiguous, say so and cite the closest official statement. Prefer primary vendor docs over blog posts unless the repo already relies on them (Antigravity).

## Constraints

- Do not add runtime web scraping to the app; this audit is a **maintainer / periodic** task.
- Do not remove “observed” Antigravity paths without evidence they are obsolete.
- Keep `agentIds` accurate per docs (compatibility paths are intentional for Cursor).
- After changes, ensure `npm run lint` and `npm run build` would pass.

Begin by reading the repo files, then fetch each official docs URL listed above.
```

---

## When to run this

- After a major IDE/CLI release notes mention “skills” paths.
- Quarterly maintenance, or before a hub release that touches scanning.
- When a user reports skills missing from the Installed page.

## Related docs

- [`SCAN_PATHS.md`](./SCAN_PATHS.md) — static path table maintained in the repo
- [`ROADMAP.md`](./ROADMAP.md) — planned automated path drift checking (not implemented yet)

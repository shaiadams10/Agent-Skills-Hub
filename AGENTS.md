# AGENTS.md — Agent Skills Hub

Update this file when project structure or behavior changes.

## Project

Local web app (Next.js) to **view installed agent skills** on the user's machine (global + per-project) and eventually discover/install skills.

Runs on **localhost only** — uses Node.js filesystem APIs to read skill folders.

## Install (for agents helping end users)

When asked to install this app from GitHub, follow **[INSTALL.md](./INSTALL.md)** (detect OS; Windows or macOS only for guided install). Prompt templates: **[docs/INSTALL_PROMPT.md](./docs/INSTALL_PROMPT.md)**.

## Structure

```
AgentSkillsHub/
├── public/
│   ├── images/hero-local-skills-scan.png  # Home hero illustration (pixel art)
│   └── icons/agents/*.svg                 # Agent tool icons (registry `iconFile`)
├── src/
│   ├── app/                     # Pages + API routes
│   │   ├── api/installed/       # GET scan (+ optional git upstream check, ?checkUpdates=0 | forceGit=1)
│   │   ├── api/projects/        # POST/DELETE watched project paths
│   │   ├── api/settings/        # User prefs (enabled agents)
│   │   ├── installed/           # My installed skills UI, skill + project library routes
│   │   └── setup/               # Onboarding: pick coding tools
│   └── lib/
│       ├── agents/registry.ts   # Supported tools metadata (name, icon, docs)
│       ├── agents/skill-paths.ts # Doc-aligned scan paths per tool
│       ├── scanner/             # SKILL.md discovery + parse
│       ├── settings/store.ts    # ~/.agent-skills-hub/settings.json
│       ├── skills/              # Managed paths, delete, detail read, install-origin, git update cache
│       ├── dialog/              # Native folder picker (Windows: bin/pick-folder-win.exe, build via npm run build:picker)
│       └── installer/           # Copy skill folders (future install flow)
├── scripts/
│   ├── install.ps1              # Windows install helper
│   ├── install-mac.sh           # macOS install helper
│   └── build-picker.ps1         # Rebuild pick-folder-win.exe (Windows)
```

## Configuration

- User settings: `%USERPROFILE%\.agent-skills-hub\settings.json`
- Watched projects + enabled agent IDs stored there
- **`install_source` / `installed_by` in SKILL.md** — `install_source`: manual | agent_tool | unknown; `installed_by`: hub agent id (e.g. `codex`, `copilot`). **Install origin** (`src/lib/skills/install-origin.ts`) labels a skill via three tiers driven by the `AGENT_PROVISIONING_SIGNALS` table — adding new agents is a single-record append:
  1. **Declared** — SKILL.md frontmatter wins (highest confidence).
  2. **Bundled path** — the folder lives in a place the tool ships into. Today only Codex `.codex/skills/.system/**`.
  3. **Managed-global path** — scope = global *and* the folder is in the tool's documented installer home. Today only Codex `~/.codex/skills/` (where `skill-installer` writes; openai/skills remote also recorded as a future high-confidence signal). Project-scope copies stay **Manually Installed** since users almost always author per-project skills by hand.
  Everything else defaults to **Manually Installed** with a hint to set `install_source: manual` if needed to override the managed-global heuristic. The user-authoring conventions (`.cursor/skills`, `.agent/skills`, project-scope `.codex/skills`, `.gemini/skills`, `.github/skills`, `.copilot/skills`, `.windsurf/skills`, `.kilo/skills`, `.opencode/skills`, `.hermes/skills`, `.agents/skills`, `.claude/skills`) never auto-promote to "Installed By X". **Git updates:** if the skill folder is a clone with `origin`, GET `/api/installed` compares `HEAD` to `origin` (requires `git` on PATH, optional network). Results cached in `%USERPROFILE%\.agent-skills-hub\update-check-cache.json` (~4h TTL); use **Re-check git** to bypass cache.
## Status

- [x] Scaffold Next.js app
- [x] Scan global + project SKILL.md installations
- [x] Installed skills UI with refresh
- [x] Add project folder (paste path)
- [x] Setup: select coding tools
- [x] Windows one-click `Start Agent Skills Hub.bat`
- [x] macOS `Start Agent Skills Hub.command`
- [x] Agent-oriented install guide [`INSTALL.md`](./INSTALL.md)
- [x] Browse for folder (native picker via API)
- [x] Scan all tools (Setup filter no longer hides skills)
- [x] Expanded global/project path registry + `.agents/skills`
- [x] Delete skills from web UI
- [x] Show all compatible tools per skill (badges + placeholder icons)
- [x] Doc-verified scan paths (`skill-paths.ts`, `docs/SCAN_PATHS.md`)
- [x] Retro Pixel UI (Cyber‑Vandal: Space Mono, neo‑brutalist shell)
- [x] Skill detail route `/installed/skill/[key]` (base64url of SKILL.md path)
- [x] Project skill library route `/installed/project/[key]` (per-watched-project cards)
- [x] Collapsible global / project sections on Installed
- [x] Install origin + git upstream hints — tiered: declared frontmatter → bundled path → managed-global path (Codex `~/.codex/skills/` from `skill-installer`); per-agent signals table for extensibility
- [x] Agent icons in `public/icons/agents/` (registry `iconFile`)
- [ ] Skill discovery catalog
- [ ] One-click install skills to correct paths
- [ ] Windows `.exe` / `.msi` and macOS `.dmg` installers (see [`docs/ROADMAP.md`](./docs/ROADMAP.md))

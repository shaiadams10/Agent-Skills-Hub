# Install Agent Skills Hub

**For AI coding agents:** When the user asks you to install Agent Skills Hub from GitHub, follow this document end-to-end for **their operating system**. Detect **Windows** vs **macOS** yourself (`process.platform`, `uname`, or environment). Only ask the user if detection is ambiguous. Ensure **every requirement** below is satisfied (install Node 20+ LTS if missing). Do not ask them to run terminal commands manually unless a step fails.

**Do not** set up Stitch, Google MCP design tools, or other optional design-time tooling — they are not part of this app.

**For humans:** Use a prompt from [`docs/INSTALL_PROMPT.md`](./docs/INSTALL_PROMPT.md), or follow the steps below.

---

## Repository

Clone the URL the user provides (example shape):

`https://github.com/shaiadams10/AgentSkillsHub`

If no URL is given, ask once for the GitHub repository link.

---

## Supported platforms (install targets)

| Platform | Install | Start app |
|----------|---------|-----------|
| **Windows 10/11** | `scripts/install.ps1` or steps below | `Start Agent Skills Hub.bat` |
| **macOS 12+** | `scripts/install-mac.sh` or steps below | `Start Agent Skills Hub.command` or `npm run dev` |

**Linux is not supported** for guided install at this time (no official Browse picker). Developers may still run from source.

---

## Requirements (check before install)

| Requirement | Required | Notes |
|-------------|----------|--------|
| **Node.js** | **Yes** | v20 or newer (`node -v`). If missing, install from https://nodejs.org/ (LTS). On Windows prefer the official installer; on Mac prefer the LTS pkg or `brew install node@20` if Homebrew is already used. |
| **npm** | **Yes** | Ships with Node (`npm -v`). |
| **Git** | No | Only needed to clone; optional for in-app “git update” hints on skill folders. |
| **Internet** | First install | For `npm install` dependencies. |
| **Disk** | ~200 MB | `node_modules` + app. |

**Windows only:** `src/lib/dialog/bin/pick-folder-win.exe` is committed in the repo. If missing, run `npm run build:picker` from the project root (requires .NET Framework `csc.exe`, included on Windows).

**macOS only:** Folder Browse uses built-in `osascript` (no extra install).

---

## Agent install procedure

Execute in order. Report progress briefly after each major step.

### 1. Clone

```bash
git clone <REPO_URL>
cd AgentSkillsHub
```

If the user already has the folder, `cd` into it and continue.

### 2. Verify Node

```bash
node -v
```

Must be `v20.x` or higher. If not installed, install Node.js LTS for the user’s OS (see Requirements), then re-check.

### 3. Install dependencies

```bash
npm install
```

Must exit 0. On failure, show the error and stop.

### 4. Platform-specific setup

**Windows:**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/install.ps1
```

Or verify picker exists:

```text
src/lib/dialog/bin/pick-folder-win.exe
```

If missing: `npm run build:picker`

**macOS:**

```bash
chmod +x scripts/install-mac.sh "Start Agent Skills Hub.command"
./scripts/install-mac.sh
```

### 5. Start the app

**Windows** (preferred for non-technical users):

- Run `Start Agent Skills Hub.bat` from the project folder (double-click in Explorer), **or**
- `npm run dev` in a terminal and keep it open.

**macOS:**

- Double-click `Start Agent Skills Hub.command`, **or**
- `npm run dev` in a terminal.

The dev server uses **port 3000** by default.

### 6. Verify

1. Wait until the terminal shows Next.js ready (e.g. `Local: http://localhost:3000`).
2. Open http://localhost:3000 in the default browser.
3. Confirm the home page loads (title / “Agent Skills Hub” content).
4. Optional: `GET http://localhost:3000/api/installed` should return JSON (may be empty skills list).

Tell the user:

- Keep the terminal window open while using the app.
- First visit: open **Setup** to choose tools, then **My installed skills** to scan.
- Stop the app with Ctrl+C in that terminal.

---

## What gets created on the user’s machine

| Path | Purpose |
|------|---------|
| `<project>/node_modules/` | App dependencies |
| `%USERPROFILE%\.agent-skills-hub\settings.json` (Windows) or `~/.agent-skills-hub/settings.json` (Mac) | Watched projects, enabled agents (created on first use) |

---

## Troubleshooting (agents)

| Problem | Action |
|---------|--------|
| `node` not found | Install Node 20+ LTS; restart terminal. |
| `npm install` fails | Check network; delete `node_modules` and retry; ensure Node 20+. |
| Port 3000 in use | Stop other process or run `npm run dev -- -p 3001` and open that port. |
| Windows Browse shows error | Run `npm run build:picker`; ensure `pick-folder-win.exe` exists. |
| Mac Browse does nothing | Use **paste path** in Add project; confirm `osascript` runs. |
| SmartScreen blocks `.exe` | User may need “More info” → “Run anyway” for the picker once (dev builds). |

---

## Uninstall

1. Stop the dev server (Ctrl+C).
2. Delete the cloned project folder.
3. Optionally delete user config: `.agent-skills-hub` in the user home directory.

---

## Related docs

- [`README.md`](./README.md) — overview
- [`docs/INSTALL_PROMPT.md`](./docs/INSTALL_PROMPT.md) — copy-paste prompts for agents
- [`AGENTS.md`](./AGENTS.md) — codebase map for agents working in the repo
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — planned features (including desktop installers)

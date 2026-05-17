# Roadmap

Planned work for Agent Skills Hub. Order may change.

## Distribution & install

| Item | Status | Notes |
|------|--------|--------|
| **AI-agent install guide** | Done | [`INSTALL.md`](../INSTALL.md) — users give agents the GitHub repo URL + this file |
| **Windows `Start Agent Skills Hub.bat`** | Done | First-run `npm install`, opens browser |
| **macOS `Start Agent Skills Hub.command`** | Done | Same flow as `.bat` |
| **Windows `.exe` / `.msi` installer** | Planned | Bundled app, no Node required for end users |
| **macOS `.dmg` installer** | Planned | Drag-to-Applications `.app`, no Node required |
| **Linux install support** | Deferred | Not targeted for public install yet |

Likely approach for desktop installers: lightweight shell (e.g. Tauri) + Next.js standalone build. See discussion in project history.

## Product features

| Item | Status |
|------|--------|
| Skill discovery catalog | Planned |
| One-click install skills to correct tool paths | Planned |
| Auto-update for git-based skills | Partial (manual re-check) |

## Docs

- Scan paths: [`SCAN_PATHS.md`](./SCAN_PATHS.md)
- Design tokens: [`design.md`](./design.md)

# Security

Agent Skills Hub is a **local-only** application. It reads and writes files on the machine where you run it (skill folders, `~/.agent-skills-hub/settings.json`). It does not send your skill content to a hosted backend operated by this project.

## Reporting issues

If you find a security problem, please open a GitHub issue in this repository with details (or contact the maintainer privately if you prefer). Do not post exploit steps publicly before a fix when harm is likely.

## Safe publishing checklist (maintainers)

- No `.env` or API keys in the repository
- No personal paths or tokens in committed files
- `pick-folder-win.exe` is built from [`src/lib/dialog/picker/FolderPicker.cs`](./src/lib/dialog/picker/FolderPicker.cs) — rebuild with `npm run build:picker` after changes

## User data

| Location | Contents |
|----------|----------|
| `~/.agent-skills-hub/` | App settings (watched projects, enabled agents) |
| Project clone | `node_modules`, local dev files |

Uninstall: stop the app, delete the clone, optionally delete `~/.agent-skills-hub/`.

# Contributing

Thanks for your interest in Agent Skills Hub.

## Development setup

1. Node.js 20+
2. `git clone` and `cd` into the repo
3. `npm install`
4. **Windows:** ensure `src/lib/dialog/bin/pick-folder-win.exe` exists (`npm run build:picker` if you changed the picker)
5. `npm run dev` → http://localhost:3000

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run build:picker` | Rebuild Windows folder picker (Windows only) |

## Pull requests

- Keep changes focused; match existing TypeScript and UI patterns.
- Update [`AGENTS.md`](./AGENTS.md) if structure or behavior changes.
- Do not commit secrets, `.env` files, or personal notes.

## Install docs

End-user and agent install flow lives in [`INSTALL.md`](./INSTALL.md). Copy-paste prompts: [`docs/INSTALL_PROMPT.md`](./docs/INSTALL_PROMPT.md).

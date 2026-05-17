#!/usr/bin/env bash
# Agent Skills Hub — macOS install helper
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node 20+ LTS from https://nodejs.org/ or: brew install node@20" >&2
  exit 1
fi

MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
if [ "$MAJOR" -lt 20 ]; then
  echo "Node.js 20+ required (found $(node -v))" >&2
  exit 1
fi

echo "Installing npm dependencies..."
npm install

chmod +x "$ROOT/Start Agent Skills Hub.command" 2>/dev/null || true

echo ""
echo "Install complete. Start the app with:"
echo "  Double-click: Start Agent Skills Hub.command"
echo "  or: npm run dev"
echo ""

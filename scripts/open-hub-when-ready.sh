#!/usr/bin/env bash
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-3000}"
bash "$ROOT/scripts/wait-for-hub.sh" "$PORT" || exit 1
open "http://localhost:${PORT}/" 2>/dev/null || xdg-open "http://localhost:${PORT}/" 2>/dev/null || true

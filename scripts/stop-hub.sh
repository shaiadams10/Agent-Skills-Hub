#!/usr/bin/env bash
# Stop stale Agent Skills Hub dev server before a fresh start (macOS/Linux).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STOPPED=0

stop_pid() {
  local pid="$1"
  [[ -z "$pid" ]] && return
  kill -9 "$pid" 2>/dev/null && STOPPED=1 && echo "  Stopping previous dev server (PID $pid)..."
}

if command -v lsof >/dev/null 2>&1; then
  while read -r pid; do
    [[ -z "$pid" ]] && continue
    cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
    if [[ "$cmd" == *"$ROOT"* ]] && [[ "$cmd" == *"next"* ]]; then
      stop_pid "$pid"
    fi
  done < <(lsof -ti:3000 -sTCP:LISTEN 2>/dev/null || true)
fi

while read -r line; do
  pid="${line%% *}"
  cmd="${line#* }"
  if [[ "$cmd" == *"$ROOT"* ]] && [[ "$cmd" == *"next dev"* ]]; then
    stop_pid "$pid"
  fi
done < <(pgrep -fl node 2>/dev/null || true)

if [[ "$STOPPED" -eq 0 ]]; then
  echo "  No previous hub instance found."
fi

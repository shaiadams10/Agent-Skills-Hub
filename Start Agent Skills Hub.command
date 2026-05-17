#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo "  Agent Skills Hub - Starting..."
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "  Node.js is not installed."
  echo "  Install from https://nodejs.org/ (LTS), then run this again."
  echo ""
  read -r -p "Press Enter to close..."
  exit 1
fi

echo "  Checking for a previous instance..."
bash "$(dirname "$0")/scripts/stop-hub.sh"
echo ""

if [ ! -d "node_modules" ]; then
  echo "  First run: installing dependencies (one time only)..."
  npm install || { read -r -p "Press Enter to close..."; exit 1; }
fi

echo "  Opening http://localhost:3000 in your browser..."
open "http://localhost:3000" 2>/dev/null || true

echo "  Keep this window open while using the app."
echo "  Press Ctrl+C to stop."
echo ""

npm run dev

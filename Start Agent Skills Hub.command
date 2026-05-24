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

echo "  Starting dev server (http://localhost:3000)..."
echo "  Browser opens when ready. Keep this window open; Ctrl+C to stop."
echo ""

bash "$(dirname "$0")/scripts/open-hub-when-ready.sh" 3000 &

npm run dev

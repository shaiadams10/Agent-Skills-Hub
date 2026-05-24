#!/usr/bin/env bash
# Poll until the Hub responds on the expected port.
PORT="${1:-3000}"
URL="http://localhost:${PORT}/"
TIMEOUT="${2:-120}"
DEADLINE=$((SECONDS + TIMEOUT))

echo "  Waiting for Hub at ${URL} ..."

while [ "$SECONDS" -lt "$DEADLINE" ]; do
  if curl -sf --max-time 3 "$URL" 2>/dev/null | grep -q "Agent Skills Hub"; then
    echo "  Hub is ready."
    exit 0
  fi
  sleep 0.6
done

echo "  Timed out after ${TIMEOUT}s — is port ${PORT} blocked?"
exit 1

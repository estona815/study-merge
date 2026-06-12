#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-}"
OUT_DIR="${OUT_DIR:-output/playwright/20260608-launch-demo}"
NODE_BIN="${NODE_BIN:-}"
NODE_MODULE_DIR="${NODE_MODULE_DIR:-}"

if [[ -z "$NODE_BIN" ]]; then
  if [[ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
    NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  else
    NODE_BIN="$(command -v node || true)"
  fi
fi

if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js is required to generate screenshots." >&2
  exit 1
fi

if [[ -z "$NODE_MODULE_DIR" && -d "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules" ]]; then
  NODE_MODULE_DIR="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
fi

cleanup_server() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup_server EXIT

if [[ -z "$PORT" ]]; then
  PORT="$(python3 - <<'PY'
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(("127.0.0.1", 0))
    print(s.getsockname()[1])
PY
)"
fi

if ! curl -sSf "http://127.0.0.1:${PORT}/index.html" >/dev/null 2>&1; then
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/gwalsa-launch-screenshots.log 2>&1 &
  SERVER_PID=$!
  sleep 1
fi

mkdir -p "$OUT_DIR"

LAUNCH_BASE_URL="http://127.0.0.1:${PORT}/index.html" \
LAUNCH_SCREENSHOT_OUT="$OUT_DIR" \
NODE_PATH="$NODE_MODULE_DIR${NODE_PATH:+:$NODE_PATH}" \
"$NODE_BIN" scripts/generate-launch-screenshots.js

echo "Launch screenshots written to $OUT_DIR"

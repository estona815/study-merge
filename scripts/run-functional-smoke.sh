#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NODE_BIN="${NODE_BIN:-}"
NODE_MODULE_DIR="${NODE_MODULE_DIR:-}"
OUT_DIR="${OUT_DIR:-output/playwright/20260608-functional-smoke}"

if [[ -z "$NODE_BIN" ]]; then
  if [[ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
    NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  else
    NODE_BIN="$(command -v node || true)"
  fi
fi

if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js is required to run functional smoke." >&2
  exit 1
fi

if [[ -z "$NODE_MODULE_DIR" && -d "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules" ]]; then
  NODE_MODULE_DIR="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
fi

PORT="${PORT:-}"
pick_port() {
  python3 - <<'PY'
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(("127.0.0.1", 0))
    print(s.getsockname()[1])
PY
}

cleanup_server() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup_server EXIT

start_server() {
  local attempt
  for attempt in 1 2 3 4 5; do
    if [[ -z "$PORT" ]]; then
      PORT="$(pick_port)"
    fi
    python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/gwalsa-functional-smoke.log 2>&1 &
    SERVER_PID=$!
    sleep 1
    if curl -sSf "http://127.0.0.1:${PORT}/index.html" >/dev/null 2>&1; then
      return 0
    fi
    kill "$SERVER_PID" 2>/dev/null || true
    SERVER_PID=""
    if [[ -z "${PORT:-}" || -z "${PORT_FIXED:-}" ]]; then
      PORT=""
    fi
  done
  return 1
}

if [[ -n "$PORT" ]]; then
  PORT_FIXED=1
fi

if ! start_server; then
  echo "Functional smoke server did not respond after retries" >&2
  tail -40 /tmp/gwalsa-functional-smoke.log >&2 || true
  exit 1
fi

mkdir -p "$OUT_DIR"

FUNCTIONAL_SMOKE_BASE_URL="http://127.0.0.1:${PORT}/index.html" \
FUNCTIONAL_SMOKE_OUT="$OUT_DIR" \
NODE_PATH="$NODE_MODULE_DIR${NODE_PATH:+:$NODE_PATH}" \
"$NODE_BIN" scripts/run-functional-smoke.js

echo "Functional smoke report written to $OUT_DIR/functional-smoke-report.json"

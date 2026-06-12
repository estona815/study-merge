#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

rm -rf \
  "$ROOT/node_modules" \
  "$ROOT/.next" \
  "$ROOT/.nuxt" \
  "$ROOT/.svelte-kit" \
  "$ROOT/.vite" \
  "$ROOT/dist" \
  "$ROOT/build" \
  "$ROOT/out" \
  "$ROOT/coverage" \
  "$ROOT/.cache" \
  "$ROOT/.turbo" \
  "$ROOT/.parcel-cache"

find "$ROOT" -maxdepth 2 -type f \( -name "npm-debug.log*" -o -name "yarn-debug.log*" -o -name "pnpm-debug.log*" \) -delete

echo "Local generated caches removed from $ROOT"

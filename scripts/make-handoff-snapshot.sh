#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="/tmp/gwalsa-handoff"
OUT_FILE="$OUT_DIR/gwalsa-source-snapshot-$STAMP.txt"

mkdir -p "$OUT_DIR"

{
  echo "GwalSa App Source Snapshot"
  echo "Created: $STAMP"
  echo "Root: $ROOT"
  echo
  echo "Storage policy:"
  echo "- Keep generated snapshots in /tmp."
  echo "- Upload the TXT snapshot to Google Drive, then delete local temp files."
  echo "- Do not include node_modules, build output, raw media, or Drive handoff zip files."
  echo
  echo "File manifest:"
  find "$ROOT" \
    -type f \
    -not -path "$ROOT/.git/*" \
    -not -path "$ROOT/node_modules/*" \
    -not -path "$ROOT/.next/*" \
    -not -path "$ROOT/dist/*" \
    -not -path "$ROOT/build/*" \
    -not -path "$ROOT/assets/raw/*" \
    -not -path "$ROOT/assets/generated/*" \
    -not -path "$ROOT/media/*" \
    -not -path "$ROOT/exports/*" \
    -not -name "*.zip" \
    -print | sort | while read -r file; do
      rel="${file#$ROOT/}"
      bytes="$(wc -c < "$file" | tr -d ' ')"
      sum="$(shasum -a 256 "$file" | awk '{print $1}')"
      echo "- $rel | $bytes bytes | sha256:$sum"
    done
  echo
  echo "File contents:"
  find "$ROOT" \
    -type f \
    -not -path "$ROOT/.git/*" \
    -not -path "$ROOT/node_modules/*" \
    -not -path "$ROOT/.next/*" \
    -not -path "$ROOT/dist/*" \
    -not -path "$ROOT/build/*" \
    -not -path "$ROOT/assets/raw/*" \
    -not -path "$ROOT/assets/generated/*" \
    -not -path "$ROOT/media/*" \
    -not -path "$ROOT/exports/*" \
    -not -name "*.zip" \
    -print | sort | while read -r file; do
      rel="${file#$ROOT/}"
      echo
      echo "===== BEGIN FILE: $rel ====="
      cat "$file"
      echo
      echo "===== END FILE: $rel ====="
    done
} > "$OUT_FILE"

echo "$OUT_FILE"

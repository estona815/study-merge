#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Final launch gate =="
echo "Root: $ROOT"
echo

./scripts/launch-precheck.sh
echo

./scripts/run-functional-smoke.sh
echo

./scripts/run-real-face-model-check.sh
echo

./scripts/generate-launch-screenshots.sh
echo

./scripts/launch-readiness-audit.sh
echo

./scripts/package-web-release.sh
echo

./scripts/verify-web-release.sh
echo

./scripts/write-launch-evidence.sh
echo

./scripts/package-store-assets.sh
echo

./scripts/verify-store-assets.sh
echo

./scripts/launch-blocker-report.sh
echo

./scripts/write-launch-evidence.sh

echo
echo "Final launch gate complete."

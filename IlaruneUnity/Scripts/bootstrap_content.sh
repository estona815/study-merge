#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=unity_common.sh
source "$SCRIPT_DIR/unity_common.sh"

UNITY="$(resolve_unity_bin)"
LOG_DIR="${ILARUNE_BOOTSTRAP_LOG_DIR:-$PROJECT_ROOT/Artifacts/BootstrapLogs}"
LOG_FILE="$LOG_DIR/content-bootstrap.log"
mkdir -p "$LOG_DIR"
rm -f "$LOG_FILE"

echo "Generating deterministic Ilarune scenes and build settings."
if ! "$UNITY" \
  -batchmode \
  -nographics \
  -quit \
  -projectPath "$PROJECT_ROOT" \
  -executeMethod Ilarune.Editor.IlaruneContentBootstrap.BootstrapProject \
  -logFile "$LOG_FILE"; then
  echo "Unity content bootstrap failed. Inspect: $LOG_FILE" >&2
  exit 1
fi

SCENES=(
  "$PROJECT_ROOT/Assets/Scenes/Main.unity"
  "$PROJECT_ROOT/Assets/Scenes/Battle_Stage.unity"
  "$PROJECT_ROOT/Assets/Scenes/Battle_PvP.unity"
  "$PROJECT_ROOT/Assets/Scenes/Battle_ClanBoss.unity"
)
for scene in "${SCENES[@]}"; do
  if [[ ! -s "$scene" ]]; then
    echo "Bootstrap returned without a generated scene: $scene" >&2
    exit 1
  fi
done

if ! grep -Fq "Ilarune demo content bootstrapped:" "$LOG_FILE"; then
  echo "Unity exited without the content bootstrap success marker. Inspect: $LOG_FILE" >&2
  exit 1
fi

echo "Content bootstrap completed: ${SCENES[*]}"

#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=unity_common.sh
source "$SCRIPT_DIR/unity_common.sh"

UNITY="$(resolve_unity_bin)"
UNITY_CONTENTS="$(cd "$(dirname "$UNITY")/.." && pwd)"
ANDROID_PLAYER="$UNITY_CONTENTS/PlaybackEngines/AndroidPlayer"
if [[ ! -d "$ANDROID_PLAYER" ]]; then
  echo "Android Build Support is missing beside this Editor: $ANDROID_PLAYER" >&2
  exit 1
fi

export ILARUNE_APK_PATH="${ILARUNE_APK_PATH:-$PROJECT_ROOT/Builds/Android/Ilarune-development.apk}"
LOG_DIR="${ILARUNE_BUILD_LOG_DIR:-$PROJECT_ROOT/Artifacts/BuildLogs}"
LOG_FILE="$LOG_DIR/android-development.log"
mkdir -p "$LOG_DIR" "$(dirname "$ILARUNE_APK_PATH")"

if [[ "$ILARUNE_APK_PATH" != *.apk ]]; then
  echo "ILARUNE_APK_PATH must end in .apk for the development APK workflow: $ILARUNE_APK_PATH" >&2
  exit 2
fi

# The APK may pre-exist; require both a fresh log marker and a file newer than this invocation.
BUILD_STARTED_EPOCH="$(date +%s)"
rm -f "$LOG_FILE"

echo "Building Android development APK: $ILARUNE_APK_PATH"
if ! "$UNITY" \
  -batchmode \
  -nographics \
  -quit \
  -projectPath "$PROJECT_ROOT" \
  -executeMethod Ilarune.Editor.IlaruneBuildAutomation.BuildAndroidDevelopment \
  -logFile "$LOG_FILE"; then
  echo "Unity Android build failed. Inspect: $LOG_FILE" >&2
  exit 1
fi

if [[ ! -s "$ILARUNE_APK_PATH" ]]; then
  echo "Unity returned success but no non-empty APK exists: $ILARUNE_APK_PATH" >&2
  exit 1
fi

if ! grep -Fq "Ilarune Android development APK built:" "$LOG_FILE"; then
  echo "Unity exited without the build automation success marker. Inspect: $LOG_FILE" >&2
  exit 1
fi

if stat -f '%m' "$ILARUNE_APK_PATH" >/dev/null 2>&1; then
  APK_MODIFIED_EPOCH="$(stat -f '%m' "$ILARUNE_APK_PATH")"
else
  APK_MODIFIED_EPOCH="$(stat -c '%Y' "$ILARUNE_APK_PATH")"
fi
if (( APK_MODIFIED_EPOCH < BUILD_STARTED_EPOCH )); then
  echo "APK exists but predates this build invocation; refusing to report stale output: $ILARUNE_APK_PATH" >&2
  exit 1
fi

if command -v unzip >/dev/null 2>&1 && ! unzip -tq "$ILARUNE_APK_PATH" >/dev/null; then
  echo "APK failed ZIP integrity validation: $ILARUNE_APK_PATH" >&2
  exit 1
fi

echo "Android development APK created: $ILARUNE_APK_PATH"

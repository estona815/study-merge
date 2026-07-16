#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=unity_common.sh
source "$SCRIPT_DIR/unity_common.sh"

UNITY="$(resolve_unity_bin)"
RESULTS_DIR="${ILARUNE_TEST_RESULTS_DIR:-$PROJECT_ROOT/Artifacts/TestResults}"
PLATFORM="${ILARUNE_TEST_PLATFORM:-all}"
mkdir -p "$RESULTS_DIR"

run_platform() {
  local platform="$1"
  local result_file="$RESULTS_DIR/${platform}.xml"
  local log_file="$RESULTS_DIR/${platform}.log"
  local arguments=(
    -batchmode
    -nographics
    -projectPath "$PROJECT_ROOT"
    -runTests
    -testPlatform "$platform"
    -testResults "$result_file"
    -logFile "$log_file"
  )

  # A previous green XML must never make a failed/no-op Editor launch look green.
  rm -f "$result_file" "$log_file"

  if [[ -n "${ILARUNE_TEST_FILTER:-}" ]]; then
    arguments+=( -testFilter "$ILARUNE_TEST_FILTER" )
  fi

  echo "Running Unity $platform tests. Log: $log_file"
  if ! "$UNITY" "${arguments[@]}"; then
    echo "Unity $platform tests failed to launch or failed assertions. Inspect: $log_file" >&2
    return 1
  fi

  if [[ ! -s "$result_file" ]]; then
    echo "Unity exited without a non-empty test result: $result_file" >&2
    return 1
  fi

  if ! grep -Eq 'tests="[1-9][0-9]*"|testcase' "$result_file"; then
    echo "Unity produced a result file without any discovered tests: $result_file" >&2
    return 1
  fi
}

case "$PLATFORM" in
  all)
    run_platform EditMode
    run_platform PlayMode
    ;;
  EditMode|PlayMode)
    run_platform "$PLATFORM"
    ;;
  *)
    echo "ILARUNE_TEST_PLATFORM must be all, EditMode, or PlayMode; got: $PLATFORM" >&2
    exit 2
    ;;
esac

echo "Unity tests completed. Results: $RESULTS_DIR"

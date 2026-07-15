#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

resolve_unity_bin() {
  if [[ -n "${UNITY_BIN:-}" ]]; then
    if [[ ! -x "$UNITY_BIN" ]]; then
      echo "UNITY_BIN is not executable: $UNITY_BIN" >&2
      return 1
    fi
    printf '%s\n' "$UNITY_BIN"
    return 0
  fi

  if [[ -n "${UNITY_EDITOR:-}" ]]; then
    if [[ ! -x "$UNITY_EDITOR" ]]; then
      echo "UNITY_EDITOR is not executable: $UNITY_EDITOR" >&2
      return 1
    fi
    printf '%s\n' "$UNITY_EDITOR"
    return 0
  fi

  local candidates=(
    "/Applications/Unity/Hub/Editor/2022.3.62f3/Unity.app/Contents/MacOS/Unity"
    "/Applications/Unity/Hub/Editor/2022.3.62f2/Unity.app/Contents/MacOS/Unity"
  )
  local candidate
  for candidate in "${candidates[@]}"; do
    if [[ -x "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  if command -v Unity >/dev/null 2>&1; then
    command -v Unity
    return 0
  fi

  echo "Unity Editor was not found. Set UNITY_BIN to the Unity executable." >&2
  return 1
}

require_command_override() {
  local environment_name="$1"
  local fallback_name="$2"
  local configured="${!environment_name:-}"
  if [[ -n "$configured" ]]; then
    if [[ ! -x "$configured" ]] && ! command -v "$configured" >/dev/null 2>&1; then
      echo "$environment_name does not resolve to an executable: $configured" >&2
      return 1
    fi
    printf '%s\n' "$configured"
    return 0
  fi

  if ! command -v "$fallback_name" >/dev/null 2>&1; then
    echo "$fallback_name is required. Install it or set $environment_name." >&2
    return 1
  fi
  command -v "$fallback_name"
}

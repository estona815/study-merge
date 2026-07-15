#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=unity_common.sh
source "$SCRIPT_DIR/unity_common.sh"

if [[ "${1:-}" == "--help" ]]; then
  cat <<'USAGE'
Usage: Scripts/capture_screenshots.sh

Captures real Android frames and creates, only after all validation succeeds:
  Captures/Screenshots/lobby_720x1600.png
  Captures/Screenshots/lobby_1080x1920.png
  Captures/Screenshots/lobby_1080x2400.png
  Captures/Screenshots/lobby_1440x3200.png
  Captures/Screenshots/battle.png                 (1080x1920 by default)

Required:
  - Exactly one authorized adb device, or ANDROID_SERIAL.
  - An executable ILARUNE_SCREENSHOT_DRIVER that navigates from the freshly launched
    lobby to a real battle. Arbitrary taps are never invented by this script.
  - ImageMagick (`magick`, or `convert` + `identify`) OR ffmpeg with ffprobe/macOS sips.

Optional:
  ILARUNE_APK_PATH                 Install this APK with `adb install -r` first.
  ILARUNE_APPLICATION_ID           Default: com.ilarune.demo
  ILARUNE_ACTIVITY                 Explicit launcher activity.
  ILARUNE_SCREENSHOT_DIR           Default: Captures/Screenshots
  ILARUNE_SCREENSHOT_FIT           crop (default) or pad
  ILARUNE_BATTLE_SCREENSHOT_SIZE   Default: 1080x1920
  ILARUNE_LAUNCH_WAIT_SECONDS      Default: 3
  ILARUNE_BATTLE_WAIT_SECONDS      Default: 2
  ADB_BIN, IMAGE_MAGICK_BIN, FFMPEG_BIN, FFPROBE_BIN

The driver receives ILARUNE_ADB_BIN, ILARUNE_ANDROID_SERIAL,
ILARUNE_APPLICATION_ID, and ILARUNE_SCREENSHOT_STAGE=battle in its environment.
USAGE
  exit 0
fi

ADB="$(require_command_override ADB_BIN adb)"
PACKAGE="${ILARUNE_APPLICATION_ID:-com.ilarune.demo}"
FINAL_DIR="${ILARUNE_SCREENSHOT_DIR:-$PROJECT_ROOT/Captures/Screenshots}"
CAPTURE_PARENT="$(dirname "$FINAL_DIR")"
FIT_MODE="${ILARUNE_SCREENSHOT_FIT:-crop}"
BATTLE_SIZE="${ILARUNE_BATTLE_SCREENSHOT_SIZE:-1080x1920}"
LAUNCH_WAIT="${ILARUNE_LAUNCH_WAIT_SECONDS:-3}"
BATTLE_WAIT="${ILARUNE_BATTLE_WAIT_SECONDS:-2}"
DRIVER="${ILARUNE_SCREENSHOT_DRIVER:-}"
TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ilarune-screenshots.XXXXXX")"
COMMIT_DIR=""
BACKUP_DIR=""
ADB_TARGET=()

cleanup() {
  rm -rf "$TEMP_DIR"
  if [[ -n "$COMMIT_DIR" && -d "$COMMIT_DIR" ]]; then
    rm -rf "$COMMIT_DIR"
  fi
  if [[ -n "$BACKUP_DIR" && -d "$BACKUP_DIR" && ! -d "$FINAL_DIR" ]]; then
    mv "$BACKUP_DIR" "$FINAL_DIR" || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

validate_wait() {
  local name="$1"
  local value="$2"
  if [[ ! "$value" =~ ^[0-9]+$ ]] || (( value > 30 )); then
    echo "$name must be an integer from 0 to 30; got: $value" >&2
    exit 2
  fi
}

validate_wait ILARUNE_LAUNCH_WAIT_SECONDS "$LAUNCH_WAIT"
validate_wait ILARUNE_BATTLE_WAIT_SECONDS "$BATTLE_WAIT"
if [[ "$FIT_MODE" != "crop" && "$FIT_MODE" != "pad" ]]; then
  echo "ILARUNE_SCREENSHOT_FIT must be crop or pad; got: $FIT_MODE" >&2
  exit 2
fi
if [[ ! "$BATTLE_SIZE" =~ ^([0-9]+)x([0-9]+)$ ]]; then
  echo "ILARUNE_BATTLE_SCREENSHOT_SIZE must look like 1080x1920; got: $BATTLE_SIZE" >&2
  exit 2
fi
BATTLE_WIDTH="${BASH_REMATCH[1]}"
BATTLE_HEIGHT="${BASH_REMATCH[2]}"
if (( BATTLE_WIDTH < 1 || BATTLE_HEIGHT < 1 || BATTLE_WIDTH >= BATTLE_HEIGHT )); then
  echo "Battle screenshot size must be a positive portrait resolution; got: $BATTLE_SIZE" >&2
  exit 2
fi

PROCESSOR=""
PROCESSOR_KIND=""
PROBE=""
PROBE_KIND=""
if [[ -n "${IMAGE_MAGICK_BIN:-}" ]]; then
  if [[ ! -x "$IMAGE_MAGICK_BIN" ]] && ! command -v "$IMAGE_MAGICK_BIN" >/dev/null 2>&1; then
    echo "IMAGE_MAGICK_BIN does not resolve to an executable: $IMAGE_MAGICK_BIN" >&2
    exit 1
  fi
  PROCESSOR="$IMAGE_MAGICK_BIN"
  if [[ "$(basename "$PROCESSOR")" == "magick" ]]; then
    PROCESSOR_KIND=magick
    PROBE="$PROCESSOR"
    PROBE_KIND=magick
  elif command -v identify >/dev/null 2>&1; then
    PROCESSOR_KIND=convert
    PROBE="$(command -v identify)"
    PROBE_KIND=identify
  else
    echo "IMAGE_MAGICK_BIN points to a convert-style binary, but identify is unavailable." >&2
    exit 1
  fi
elif command -v magick >/dev/null 2>&1; then
  PROCESSOR="$(command -v magick)"
  PROCESSOR_KIND=magick
  PROBE="$PROCESSOR"
  PROBE_KIND=magick
elif command -v convert >/dev/null 2>&1 && command -v identify >/dev/null 2>&1; then
  PROCESSOR="$(command -v convert)"
  PROCESSOR_KIND=convert
  PROBE="$(command -v identify)"
  PROBE_KIND=identify
else
  PROCESSOR="$(require_command_override FFMPEG_BIN ffmpeg)"
  PROCESSOR_KIND=ffmpeg
  if [[ -n "${FFPROBE_BIN:-}" ]]; then
    PROBE="$(require_command_override FFPROBE_BIN ffprobe)"
  elif command -v ffprobe >/dev/null 2>&1; then
    PROBE="$(command -v ffprobe)"
  elif [[ -x "$(dirname "$PROCESSOR")/ffprobe" ]]; then
    PROBE="$(dirname "$PROCESSOR")/ffprobe"
  elif command -v sips >/dev/null 2>&1; then
    # macOS ships sips, which is sufficient for exact PNG dimension validation.
    PROBE="$(command -v sips)"
    PROBE_KIND=sips
  else
    echo "ffprobe (or macOS sips) is required to validate PNG dimensions. Set FFPROBE_BIN." >&2
    exit 1
  fi
  if [[ -z "$PROBE_KIND" ]]; then
    PROBE_KIND=ffprobe
  fi
fi

DEVICE_SERIAL=""
if [[ -n "${ANDROID_SERIAL:-}" ]]; then
  DEVICE_SERIAL="$ANDROID_SERIAL"
  ADB_TARGET=( -s "$DEVICE_SERIAL" )
  if [[ "$($ADB "${ADB_TARGET[@]}" get-state 2>/dev/null || true)" != "device" ]]; then
    echo "ANDROID_SERIAL is not an authorized online adb device: $DEVICE_SERIAL" >&2
    exit 1
  fi
else
  DEVICES=()
  while IFS= read -r serial; do
    [[ -n "$serial" ]] && DEVICES+=( "$serial" )
  done < <("$ADB" devices | awk '$2 == "device" { print $1 }')
  if (( ${#DEVICES[@]} != 1 )); then
    echo "Expected exactly one authorized adb device, found ${#DEVICES[@]}. Set ANDROID_SERIAL when multiple devices are connected." >&2
    exit 1
  fi
  DEVICE_SERIAL="${DEVICES[0]}"
  ADB_TARGET=( -s "$DEVICE_SERIAL" )
fi

if [[ -z "$DRIVER" || ! -x "$DRIVER" ]]; then
  echo "ILARUNE_SCREENSHOT_DRIVER must be an executable that navigates the real app from lobby to battle." >&2
  exit 1
fi

if [[ -n "${ILARUNE_APK_PATH:-}" ]]; then
  if [[ ! -s "$ILARUNE_APK_PATH" ]]; then
    echo "ILARUNE_APK_PATH is not a non-empty APK: $ILARUNE_APK_PATH" >&2
    exit 1
  fi
  "$ADB" "${ADB_TARGET[@]}" install -r "$ILARUNE_APK_PATH"
fi

if ! "$ADB" "${ADB_TARGET[@]}" shell pm path "$PACKAGE" >/dev/null 2>&1; then
  echo "Package $PACKAGE is not installed. Set ILARUNE_APK_PATH to install it first." >&2
  exit 1
fi

probe_dimensions() {
  local file="$1"
  case "$PROBE_KIND" in
    magick)
      "$PROBE" identify -format '%w %h' "$file"
      ;;
    identify)
      "$PROBE" -format '%w %h' "$file"
      ;;
    ffprobe)
      "$PROBE" -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=' ':p=0 "$file"
      ;;
    sips)
      "$PROBE" -g pixelWidth -g pixelHeight "$file" 2>/dev/null \
        | awk '/pixelWidth:/ { width = $2 } /pixelHeight:/ { height = $2 } END { print width, height }'
      ;;
  esac
}

validate_png() {
  local file="$1"
  local expected_width="$2"
  local expected_height="$3"
  if [[ ! -s "$file" ]]; then
    echo "PNG is missing or empty: $file" >&2
    return 1
  fi

  local dimensions width height
  dimensions="$(probe_dimensions "$file")" || {
    echo "PNG metadata validation failed: $file" >&2
    return 1
  }
  read -r width height <<< "$dimensions"
  if [[ ! "$width" =~ ^[0-9]+$ || ! "$height" =~ ^[0-9]+$ ]]; then
    echo "Could not parse PNG dimensions '$dimensions': $file" >&2
    return 1
  fi
  if (( expected_width > 0 )) && (( width != expected_width || height != expected_height )); then
    echo "Expected ${expected_width}x${expected_height}, found ${width}x${height}: $file" >&2
    return 1
  fi
  if (( width >= height )); then
    echo "Expected a portrait PNG, found ${width}x${height}: $file" >&2
    return 1
  fi
}

capture_raw_png() {
  local destination="$1"
  if ! "$ADB" "${ADB_TARGET[@]}" exec-out screencap -p > "$destination"; then
    rm -f "$destination"
    echo "adb screencap failed; no screenshot output was committed." >&2
    return 1
  fi
  validate_png "$destination" 0 0
}

scale_png() {
  local source="$1"
  local destination="$2"
  local width="$3"
  local height="$4"
  if [[ "$PROCESSOR_KIND" == "magick" ]]; then
    if [[ "$FIT_MODE" == "crop" ]]; then
      "$PROCESSOR" "$source" -filter Lanczos -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" -strip "PNG32:$destination"
    else
      "$PROCESSOR" "$source" -filter Lanczos -resize "${width}x${height}" -background black -gravity center -extent "${width}x${height}" -strip "PNG32:$destination"
    fi
  elif [[ "$PROCESSOR_KIND" == "convert" ]]; then
    if [[ "$FIT_MODE" == "crop" ]]; then
      "$PROCESSOR" "$source" -filter Lanczos -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" -strip "PNG32:$destination"
    else
      "$PROCESSOR" "$source" -filter Lanczos -resize "${width}x${height}" -background black -gravity center -extent "${width}x${height}" -strip "PNG32:$destination"
    fi
  else
    local filter
    if [[ "$FIT_MODE" == "crop" ]]; then
      filter="scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}"
    else
      filter="scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black"
    fi
    "$PROCESSOR" -y -v error -i "$source" -vf "$filter" -frames:v 1 -update 1 "$destination"
  fi
  validate_png "$destination" "$width" "$height"
}

launch_clean_app() {
  "$ADB" "${ADB_TARGET[@]}" shell am force-stop "$PACKAGE"
  if [[ -n "${ILARUNE_ACTIVITY:-}" ]]; then
    "$ADB" "${ADB_TARGET[@]}" shell am start -W -n "$PACKAGE/$ILARUNE_ACTIVITY"
  else
    "$ADB" "${ADB_TARGET[@]}" shell monkey -p "$PACKAGE" -c android.intent.category.LAUNCHER 1 >/dev/null
  fi
  sleep "$LAUNCH_WAIT"
}

LOBBY_RAW="$TEMP_DIR/lobby-native.png"
BATTLE_RAW="$TEMP_DIR/battle-native.png"
launch_clean_app
capture_raw_png "$LOBBY_RAW"

if ! ILARUNE_ADB_BIN="$ADB" \
  ILARUNE_ANDROID_SERIAL="$DEVICE_SERIAL" \
  ILARUNE_APPLICATION_ID="$PACKAGE" \
  ILARUNE_SCREENSHOT_STAGE=battle \
  "$DRIVER"; then
  echo "Battle navigation driver failed; no final screenshots were replaced." >&2
  exit 1
fi
sleep "$BATTLE_WAIT"
capture_raw_png "$BATTLE_RAW"

STAGED_OUTPUTS="$TEMP_DIR/validated"
mkdir -p "$STAGED_OUTPUTS"
scale_png "$LOBBY_RAW" "$STAGED_OUTPUTS/lobby_720x1600.png" 720 1600
scale_png "$LOBBY_RAW" "$STAGED_OUTPUTS/lobby_1080x1920.png" 1080 1920
scale_png "$LOBBY_RAW" "$STAGED_OUTPUTS/lobby_1080x2400.png" 1080 2400
scale_png "$LOBBY_RAW" "$STAGED_OUTPUTS/lobby_1440x3200.png" 1440 3200
scale_png "$BATTLE_RAW" "$STAGED_OUTPUTS/battle.png" "$BATTLE_WIDTH" "$BATTLE_HEIGHT"

# Validate the complete required set again before touching any existing final output.
validate_png "$STAGED_OUTPUTS/lobby_720x1600.png" 720 1600
validate_png "$STAGED_OUTPUTS/lobby_1080x1920.png" 1080 1920
validate_png "$STAGED_OUTPUTS/lobby_1080x2400.png" 1080 2400
validate_png "$STAGED_OUTPUTS/lobby_1440x3200.png" 1440 3200
validate_png "$STAGED_OUTPUTS/battle.png" "$BATTLE_WIDTH" "$BATTLE_HEIGHT"

mkdir -p "$CAPTURE_PARENT"
COMMIT_DIR="$CAPTURE_PARENT/.Screenshots.commit.$$"
BACKUP_DIR="$CAPTURE_PARENT/.Screenshots.backup.$$"
rm -rf "$COMMIT_DIR" "$BACKUP_DIR"
mkdir -p "$COMMIT_DIR"
if [[ -d "$FINAL_DIR" ]]; then
  cp -R "$FINAL_DIR/." "$COMMIT_DIR/"
fi
cp "$STAGED_OUTPUTS/"*.png "$COMMIT_DIR/"

if [[ -d "$FINAL_DIR" ]]; then
  mv "$FINAL_DIR" "$BACKUP_DIR"
fi
if ! mv "$COMMIT_DIR" "$FINAL_DIR"; then
  if [[ -d "$BACKUP_DIR" ]]; then
    mv "$BACKUP_DIR" "$FINAL_DIR"
  fi
  echo "Atomic screenshot directory replacement failed; previous outputs were restored." >&2
  exit 1
fi
COMMIT_DIR=""
if [[ -d "$BACKUP_DIR" ]]; then
  rm -rf "$BACKUP_DIR"
fi
BACKUP_DIR=""

echo "Validated screenshots committed under: $FINAL_DIR"
echo "Battle state was supplied by driver: $DRIVER"

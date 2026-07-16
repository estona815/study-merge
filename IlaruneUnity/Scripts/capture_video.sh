#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=unity_common.sh
source "$SCRIPT_DIR/unity_common.sh"

if [[ "${1:-}" == "--help" ]]; then
  cat <<'USAGE'
Usage: Scripts/capture_video.sh

Captures real Android output only. Default ILARUNE_CAPTURE_MODE=all creates:
  Captures/Ilarune_Hub_Native.mp4             native device ratio, source frame rate
  Captures/Ilarune_Promo_9x16_60fps.mp4       1080x1920, 60fps, H.264, 30s default
  Captures/Ilarune_Hub_IdleLoop.mp4            native ratio, 60fps, 15s default
  Captures/Raw/*.mp4                           unmodified adb recordings

Required tools: ADB_BIN/adb, FFMPEG_BIN/ffmpeg, FFPROBE_BIN/ffprobe.
Modes: ILARUNE_CAPTURE_MODE=all|promo|idle.
Promo duration: ILARUNE_CAPTURE_DURATION=30..60. Idle: ILARUNE_IDLE_DURATION=12..15.
Optional executable ILARUNE_CAPTURE_DRIVER receives adb details through environment variables.
Set ILARUNE_APK_PATH to install an APK before capture and ANDROID_SERIAL to select a device.
USAGE
  exit 0
fi

ADB="$(require_command_override ADB_BIN adb)"
FFMPEG="$(require_command_override FFMPEG_BIN ffmpeg)"
if [[ -n "${FFPROBE_BIN:-}" ]]; then
  FFPROBE="$(require_command_override FFPROBE_BIN ffprobe)"
elif command -v ffprobe >/dev/null 2>&1; then
  FFPROBE="$(command -v ffprobe)"
elif [[ -x "$(dirname "$FFMPEG")/ffprobe" ]]; then
  FFPROBE="$(dirname "$FFMPEG")/ffprobe"
else
  echo "ffprobe is required for output validation. Install it or set FFPROBE_BIN." >&2
  exit 1
fi

MODE="${ILARUNE_CAPTURE_MODE:-all}"
PROMO_DURATION="${ILARUNE_CAPTURE_DURATION:-30}"
IDLE_DURATION="${ILARUNE_IDLE_DURATION:-15}"
WAIT_SECONDS="${ILARUNE_LAUNCH_WAIT_SECONDS:-3}"
BIT_RATE="${ILARUNE_CAPTURE_BIT_RATE:-20000000}"
DELIVERY_FPS=60
PACKAGE="${ILARUNE_APPLICATION_ID:-com.ilarune.demo}"
CAPTURE_DIR="${ILARUNE_CAPTURE_DIR:-$PROJECT_ROOT/Captures}"
RAW_DIR="${ILARUNE_RAW_CAPTURE_DIR:-$CAPTURE_DIR/Raw}"
NATIVE_OUTPUT="${ILARUNE_NATIVE_VIDEO_PATH:-$CAPTURE_DIR/Ilarune_Hub_Native.mp4}"
PROMO_OUTPUT="${ILARUNE_PROMO_VIDEO_PATH:-${ILARUNE_VIDEO_PATH:-$CAPTURE_DIR/Ilarune_Promo_9x16_60fps.mp4}}"
IDLE_OUTPUT="${ILARUNE_IDLE_VIDEO_PATH:-$CAPTURE_DIR/Ilarune_Hub_IdleLoop.mp4}"
PROMO_RAW_OUTPUT="${ILARUNE_PROMO_RAW_PATH:-$RAW_DIR/Ilarune_Promo_DeviceRaw.mp4}"
IDLE_RAW_OUTPUT="${ILARUNE_IDLE_RAW_PATH:-$RAW_DIR/Ilarune_Hub_IdleRaw.mp4}"
KEEP_RAW="${ILARUNE_KEEP_RAW:-1}"
SOCIAL_FIT="${ILARUNE_SOCIAL_FIT:-crop}"
CAPTURE_DRIVER="${ILARUNE_CAPTURE_DRIVER:-}"
CAPTURE_SIZE="${ILARUNE_NATIVE_CAPTURE_SIZE:-}"
TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ilarune-capture.XXXXXX")"
CURRENT_REMOTE=""
RECORDED_SOURCE=""
ADB_TARGET=()

cleanup() {
  if [[ -n "$CURRENT_REMOTE" ]] && [[ ${#ADB_TARGET[@]} -gt 0 ]]; then
    "$ADB" "${ADB_TARGET[@]}" shell rm -f "$CURRENT_REMOTE" >/dev/null 2>&1 || true
  fi
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT INT TERM

validate_integer_range() {
  local name="$1"
  local value="$2"
  local minimum="$3"
  local maximum="$4"
  if [[ ! "$value" =~ ^[0-9]+$ ]] || (( value < minimum || value > maximum )); then
    echo "$name must be an integer from $minimum to $maximum; got: $value" >&2
    exit 2
  fi
}

case "$MODE" in
  all|promo|idle) ;;
  *)
    echo "ILARUNE_CAPTURE_MODE must be all, promo, or idle; got: $MODE" >&2
    exit 2
    ;;
esac
validate_integer_range ILARUNE_CAPTURE_DURATION "$PROMO_DURATION" 30 60
validate_integer_range ILARUNE_IDLE_DURATION "$IDLE_DURATION" 12 15
validate_integer_range ILARUNE_LAUNCH_WAIT_SECONDS "$WAIT_SECONDS" 0 30
validate_integer_range ILARUNE_CAPTURE_BIT_RATE "$BIT_RATE" 1000000 100000000

if [[ "$KEEP_RAW" != "0" && "$KEEP_RAW" != "1" ]]; then
  echo "ILARUNE_KEEP_RAW must be 0 or 1; got: $KEEP_RAW" >&2
  exit 2
fi
if [[ "$SOCIAL_FIT" != "crop" && "$SOCIAL_FIT" != "pad" ]]; then
  echo "ILARUNE_SOCIAL_FIT must be crop or pad; got: $SOCIAL_FIT" >&2
  exit 2
fi
if [[ -n "$CAPTURE_SIZE" ]] && [[ ! "$CAPTURE_SIZE" =~ ^[0-9]+x[0-9]+$ ]]; then
  echo "ILARUNE_NATIVE_CAPTURE_SIZE must look like 1080x2400; got: $CAPTURE_SIZE" >&2
  exit 2
fi
if [[ -n "$CAPTURE_DRIVER" && ! -x "$CAPTURE_DRIVER" ]]; then
  echo "ILARUNE_CAPTURE_DRIVER must be an executable file: $CAPTURE_DRIVER" >&2
  exit 2
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

launch_clean_app() {
  "$ADB" "${ADB_TARGET[@]}" shell am force-stop "$PACKAGE"
  if [[ -n "${ILARUNE_ACTIVITY:-}" ]]; then
    "$ADB" "${ADB_TARGET[@]}" shell am start -W -n "$PACKAGE/$ILARUNE_ACTIVITY"
  else
    "$ADB" "${ADB_TARGET[@]}" shell monkey -p "$PACKAGE" -c android.intent.category.LAUNCHER 1 >/dev/null
  fi
  sleep "$WAIT_SECONDS"
}

probe_stream_value() {
  local file="$1"
  local entry="$2"
  "$FFPROBE" -v error -select_streams v:0 -show_entries "stream=$entry" -of default=noprint_wrappers=1:nokey=1 "$file" | head -1
}

probe_duration() {
  "$FFPROBE" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$1" | head -1
}

rate_as_decimal() {
  awk -v rate="$1" 'BEGIN { split(rate, parts, "/"); if (parts[2] == 0 || parts[2] == "") exit 1; printf "%.3f", parts[1] / parts[2] }'
}

verify_video() {
  local file="$1"
  local expected_duration="$2"
  local required_width="$3"
  local required_height="$4"
  local required_fps="$5"
  if [[ ! -s "$file" ]]; then
    echo "Video is missing or empty: $file" >&2
    return 1
  fi

  local codec width height rate duration decimal_rate minimum_duration maximum_duration
  codec="$(probe_stream_value "$file" codec_name)"
  width="$(probe_stream_value "$file" width)"
  height="$(probe_stream_value "$file" height)"
  rate="$(probe_stream_value "$file" avg_frame_rate)"
  duration="$(probe_duration "$file")"
  decimal_rate="$(rate_as_decimal "$rate")" || {
    echo "Could not parse frame rate '$rate' for $file" >&2
    return 1
  }

  if [[ "$codec" != "h264" ]]; then
    echo "Expected H.264 video, found '$codec': $file" >&2
    return 1
  fi
  if [[ ! "$width" =~ ^[0-9]+$ || ! "$height" =~ ^[0-9]+$ ]] || (( width >= height )); then
    echo "Expected portrait dimensions, found ${width}x${height}: $file" >&2
    return 1
  fi
  if (( required_width > 0 )) && (( width != required_width || height != required_height )); then
    echo "Expected ${required_width}x${required_height}, found ${width}x${height}: $file" >&2
    return 1
  fi
  if (( required_fps > 0 )) && ! awk -v actual="$decimal_rate" -v expected="$required_fps" 'BEGIN { exit !(actual >= expected - 0.1 && actual <= expected + 0.1) }'; then
    echo "Expected ${required_fps}fps delivery, found ${decimal_rate}fps: $file" >&2
    return 1
  fi

  minimum_duration=$(( expected_duration - 3 ))
  maximum_duration=$(( expected_duration + 5 ))
  if ! awk -v actual="$duration" -v minimum="$minimum_duration" -v maximum="$maximum_duration" 'BEGIN { exit !(actual >= minimum && actual <= maximum) }'; then
    echo "Expected roughly ${expected_duration}s, found ${duration}s: $file" >&2
    return 1
  fi

  if ! "$FFMPEG" -v error -i "$file" -map 0:v:0 -f null -; then
    echo "Full decode verification failed: $file" >&2
    return 1
  fi

  echo "Verified H.264 portrait video: $file (${width}x${height}, ${decimal_rate}fps, ${duration}s)"
}

record_device_segment() {
  local label="$1"
  local duration="$2"
  local raw_destination="$3"
  local allow_driver="$4"
  local temporary_raw="$TEMP_DIR/${label}.device.mp4"
  CURRENT_REMOTE="/sdcard/ilarune_${label}_$$.mp4"

  local screenrecord_arguments=(
    shell screenrecord
    --bit-rate "$BIT_RATE"
    --time-limit "$duration"
  )
  if [[ -n "$CAPTURE_SIZE" ]]; then
    screenrecord_arguments+=( --size "$CAPTURE_SIZE" )
  fi
  screenrecord_arguments+=( "$CURRENT_REMOTE" )

  echo "Recording '$label' from the physical device for ${duration}s at the device's native portrait ratio."
  if [[ "$allow_driver" == "1" && -n "$CAPTURE_DRIVER" ]]; then
    "$ADB" "${ADB_TARGET[@]}" "${screenrecord_arguments[@]}" &
    local recorder_pid=$!
    sleep 1
    if ! ILARUNE_ADB_BIN="$ADB" \
      ILARUNE_ANDROID_SERIAL="$DEVICE_SERIAL" \
      ILARUNE_APPLICATION_ID="$PACKAGE" \
      ILARUNE_CAPTURE_SEGMENT="$label" \
      ILARUNE_SEGMENT_DURATION="$duration" \
      "$CAPTURE_DRIVER"; then
      wait "$recorder_pid" || true
      echo "Capture driver failed; no final videos were replaced." >&2
      return 1
    fi
    if ! wait "$recorder_pid"; then
      echo "adb screenrecord failed for segment '$label'." >&2
      return 1
    fi
  else
    if [[ "$allow_driver" == "1" ]]; then
      echo "No ILARUNE_CAPTURE_DRIVER is set; interact with the device now to create the promo sequence."
    fi
    if ! "$ADB" "${ADB_TARGET[@]}" "${screenrecord_arguments[@]}"; then
      echo "adb screenrecord failed for segment '$label'." >&2
      return 1
    fi
  fi

  if ! "$ADB" "${ADB_TARGET[@]}" pull "$CURRENT_REMOTE" "$temporary_raw"; then
    echo "Failed to pull raw '$label' recording from the device." >&2
    return 1
  fi
  "$ADB" "${ADB_TARGET[@]}" shell rm -f "$CURRENT_REMOTE" >/dev/null
  CURRENT_REMOTE=""
  verify_video "$temporary_raw" "$duration" 0 0 0

  if [[ "$KEEP_RAW" == "1" ]]; then
    mkdir -p "$(dirname "$raw_destination")"
    mv -f "$temporary_raw" "$raw_destination"
    RECORDED_SOURCE="$raw_destination"
    echo "Preserved device raw capture: $raw_destination"
  else
    RECORDED_SOURCE="$temporary_raw"
  fi
}

encode_native_copy() {
  local source="$1"
  local destination="$2"
  local expected_duration="$3"
  local temporary="$TEMP_DIR/native-delivery.mp4"
  mkdir -p "$(dirname "$destination")"
  "$FFMPEG" -y -v error -i "$source" -map 0:v:0 -c:v copy -an -movflags +faststart "$temporary"
  verify_video "$temporary" "$expected_duration" 0 0 0
  mv -f "$temporary" "$destination"
  echo "Native portrait delivery created: $destination"
}

encode_social_delivery() {
  local source="$1"
  local destination="$2"
  local expected_duration="$3"
  local temporary="$TEMP_DIR/social-delivery.mp4"
  local filter
  if [[ "$SOCIAL_FIT" == "crop" ]]; then
    filter="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=$DELIVERY_FPS"
  else
    filter="scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,fps=$DELIVERY_FPS"
  fi

  mkdir -p "$(dirname "$destination")"
  "$FFMPEG" -y -v error -i "$source" \
    -map 0:v:0 \
    -vf "$filter" \
    -c:v libx264 \
    -preset medium \
    -crf 18 \
    -g 120 \
    -keyint_min 120 \
    -sc_threshold 0 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    "$temporary"
  verify_video "$temporary" "$expected_duration" 1080 1920 "$DELIVERY_FPS"
  mv -f "$temporary" "$destination"
  echo "9:16 60fps H.264 delivery created: $destination"
}

encode_idle_delivery() {
  local source="$1"
  local destination="$2"
  local expected_duration="$3"
  local temporary="$TEMP_DIR/idle-delivery.mp4"
  mkdir -p "$(dirname "$destination")"
  "$FFMPEG" -y -v error -i "$source" \
    -map 0:v:0 \
    -vf "fps=$DELIVERY_FPS" \
    -c:v libx264 \
    -preset medium \
    -crf 18 \
    -g 120 \
    -keyint_min 120 \
    -sc_threshold 0 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    "$temporary"
  verify_video "$temporary" "$expected_duration" 0 0 "$DELIVERY_FPS"
  mv -f "$temporary" "$destination"
  echo "Idle 60fps delivery created: $destination"
}

if [[ "$MODE" == "all" || "$MODE" == "promo" ]]; then
  launch_clean_app
  record_device_segment promo "$PROMO_DURATION" "$PROMO_RAW_OUTPUT" 1
  PROMO_SOURCE="$RECORDED_SOURCE"
  encode_native_copy "$PROMO_SOURCE" "$NATIVE_OUTPUT" "$PROMO_DURATION"
  encode_social_delivery "$PROMO_SOURCE" "$PROMO_OUTPUT" "$PROMO_DURATION"
fi

if [[ "$MODE" == "all" || "$MODE" == "idle" ]]; then
  # A clean relaunch makes this a no-input Hub capture rather than reusing the end of the promo interaction.
  launch_clean_app
  record_device_segment idle "$IDLE_DURATION" "$IDLE_RAW_OUTPUT" 0
  IDLE_SOURCE="$RECORDED_SOURCE"
  encode_idle_delivery "$IDLE_SOURCE" "$IDLE_OUTPUT" "$IDLE_DURATION"
  echo "Idle timing/animation continuity still requires visual human QC before calling it a seamless loop."
fi

echo "Requested capture mode '$MODE' completed with decode-verified files only."

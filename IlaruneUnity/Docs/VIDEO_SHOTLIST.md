# Video Shot List

All shots must come from the clean-room runtime. Do not composite APK/JPG pixels into the capture.

## Deliverables

| Output | Format | Length |
|---|---|---:|
| `Captures/Ilarune_Hub_Native.mp4` | Native portrait ratio and source frame rate | 25-35 s |
| `Captures/Ilarune_Promo_9x16_60fps.mp4` | 1080x1920, H.264, 60 fps | 25-35 s |
| `Captures/Ilarune_Hub_IdleLoop.mp4` | Portrait H.264 loop | 12-15 s |

## Current automation

`Scripts/capture_video.sh` now records separate promo and idle segments from a physical Android device. Default `all` mode creates the three named deliverables above plus `Captures/Raw/*.mp4`: native stream copy at device ratio/source frame rate, 1080x1920 H.264 promo at 60 fps, and native-ratio H.264 idle candidate at 60 fps. It validates codec, portrait dimensions, duration and delivery fps, then performs a full ffmpeg decode before replacing each output.

The native source is not forced to 1080x2400; set `ILARUNE_NATIVE_CAPTURE_SIZE=1080x2400` only if the connected device supports that `screenrecord` size. The script does not capture screenshots, and automated decode cannot prove visual polish or a seamless idle loop. Recorder 4.0.1 is declared but no working Editor Recorder pipeline is configured; the Editor capture menu intentionally explains prerequisites and creates nothing.

## Main cut, 32 seconds

| Time | Picture | Interaction / motion | Audio note |
|---|---|---|---|
| 0:00-0:05 | Wide floating-city reveal above clouds | Slow push toward the command spire; three cloud depths, two airships and distant motion visible | Original/licensed ambience only |
| 0:05-0:11 | Controlled lateral pan across building islands | Crystals pulse, steam vents, flags move, NPC silhouettes cross platforms | Add restrained city detail |
| 0:11-0:16 | Select the Aether Mine or Research Annex | Selection glow, smooth focus, readable wide action panel; collect or upgrade succeeds | Clear tap/action cue |
| 0:16-0:18 | Transition into `Battle_Stage` | Branded clean-room wipe/loading bridge, no black frame | Music lift |
| 0:18-0:25 | Match-3 combat | Valid swap, match, cascade, mana charge, hero skill and enemy hit | Original/licensed combat SFX |
| 0:25-0:29 | Victory and reward | Reward count-up; no debug text; accept reward | Short victory sting |
| 0:29-0:32 | Return to lobby wide | Currency reflects reward; camera eases back to a loopable city tableau | Resolve without hard cut |

## Crop and UI safety

- Compose native 1080x2400 with a centered 1080x1920 social-safe region.
- Keep essential labels, tap targets and reward values inside the social-safe region.
- Avoid placing text beneath cutouts, gesture bars or the crop's top/bottom 5%.
- Capture the requested resolution screenshots separately; do not upscale one screenshot to fake the set.

## Idle loop

- Use a fixed or subtly floating camera.
- Ensure cloud, airship, NPC, flag, crystal and steam cycles do not all reset on the same frame.
- Match first/last camera transform and exposure.
- Use an audio bed with a loop license or deliver silent if no cleared audio exists.

## Capture validation

Before delivery, run a decoder/probe check and watch the complete file at normal speed:

```bash
ffprobe -v error -show_entries format=duration \
  -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt \
  -of default=noprint_wrappers=1 Captures/Ilarune_Promo_9x16_60fps.mp4
```

Reject the capture if it contains black frames, editor chrome, mouse cursor, gizmos, debug labels, console errors, torn frames, severe frame pacing, clipped UI or uncleared media.

No video has been captured or validated. Unity import/build is blocked by licensing, no APK exists and no authorized adb device was connected.

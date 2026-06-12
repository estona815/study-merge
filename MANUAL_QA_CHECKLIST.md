# Manual QA Checklist

Run on desktop and target mobile browsers before launch.

## 실행 증적 기록

- 확인일: `2026-06-07`
- 실행자: launch-audit 기반 자동 검증 + 개발자 확인
- 환경: macOS Chrome (localhost:4173), 자동 증적 산출 기반

| 항목 | 상태 | 증적 | 비고 |
|---|---|---|---|
| Fresh Install | PASS | `scripts/launch-precheck.sh`, `scripts/launch-readiness-audit.sh` | 온보딩 존재 여부/404/overflow 등 정적 smoke 통과 |
| Core Flow | PASS | `output/playwright/20260608-functional-smoke/functional-smoke-report.json`, `output/playwright/20260608-launch-demo/screen-today-390.png` | 실기기 타이머 연동 수동 반복 점검은 별도 기기 실행 필요 |
| History And Photos | N/A | `output/playwright/20260608-launch-demo/screen-log-390.png` | 실기기에서 전후사진/필터/복원 1회차 점검 필요 |
| Face Guide | N/A | `output/playwright/20260608-launch-demo/screen-face-routine-390.png`, `output/playwright/20260608-launch-demo/screen-offline-reload-390.png` | 카메라 거부/업로드 fallback는 기기별 수동 점검 필요 |
| Settings And Policies | N/A | `output/playwright/20260608-launch-demo/screen-settings-390.png` | 정책 버튼(정책/약관/초기화) 동작은 기기 기반 수동 점검 필요 |
| Backup | PASS | `output/playwright/20260608-functional-smoke/functional-smoke-report.json`, `docs/launch-qa-20260607.md` | 실기기 파일 저장/복사 권한 UX는 별도 확인 필요 |
| Permissions And Offline | PASS | `scripts/launch-precheck.sh`, `output/playwright/20260608-launch-demo/screen-offline-reload-390.png` | 알림 거부 분기와 브라우저별 동작은 별도 점검 필요 |
| Display | PASS | `scripts/launch-readiness-audit.sh`, `output/playwright/20260608-launch-demo/*` | 390/430/1280 증적 기반 overflow 없음 |

상태 기입 규칙: `PASS / FAIL / N/A`

FAIL 시 `비고`에 재현 조건을 적고, `/docs/`에 `launch-qa-YYYYMMDD.md` 형태의 보조 기록을 남깁니다.

## Fresh Install

- Open the app with cleared site data.
- Confirm onboarding appears.
- Confirm policy/disclaimer wording is visible in onboarding and settings.
- Confirm no horizontal overflow at 390px width.

## Core Flow

- Start today's recommended routine.
- Pause and resume the timer.
- Advance to the next step.
- Complete a routine and confirm the completion panel appears.
- Use "기록 보기" from the completion panel.
- Confirm the saved record appears in history.

## History And Photos

- Save a manual record.
- Add before and after photos with the file picker.
- Confirm previews render.
- Confirm photo comparison renders.
- Delete a record and restore it.
- Apply each log filter.

## Face Guide

- Start the face guide from the home screen.
- Start camera mode and confirm the browser asks for camera permission only at that moment.
- Deny camera permission and confirm photo upload fallback works.
- Upload a bright front-facing test image and confirm the screen describes the result as a reference route, not a diagnosis.
- Complete a face guide routine and confirm the saved record does not include an original face image.

## Settings And Policies

- Change pressure, base, weekly goal, skin profile, and avoid zones.
- Confirm condition guide updates.
- Copy policy summary.
- Delete photos only.
- Delete records and restore if needed.
- Reset all app data and confirm the default state returns.

## Backup

- Create a light backup.
- Create a full backup.
- Copy and download backup JSON.
- Preview a backup.
- Merge a backup.
- Import a backup.
- Undo the import or merge.
- Confirm tampered backup code is rejected.
- Confirm a very large or malformed backup is rejected without freezing the page.

## Permissions And Offline

- Enable browser reminders and send a test notification where supported.
- Deny notification permission and confirm the UI handles it gracefully.
- Reload while offline after one successful online load.
- Directly open `/index.html` while offline after one successful online load.
- Restart the browser and confirm saved local data persists.

## Display

- Test 390px, 430px, tablet, and desktop widths.
- Check text wrapping inside buttons and cards.
- Confirm tap targets are comfortable.
- Confirm light theme contrast is readable.

## 남은 항목 우선순위

- 오프라인/재접속, 알림 거부, 큰/오류 백업 입력은 실기기에서 최우선으로 실행.
- 자동 점검은 통과했으므로 수동 항목은 운영 확정성 확보용으로만 판단합니다.

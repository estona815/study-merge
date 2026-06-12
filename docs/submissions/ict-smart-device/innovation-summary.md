# ICT Smart Device Innovation Summary

작성 기준: 2026-06-10 KST

## Summary

괄사 루틴은 일반 뷰티 셀프케어 루틴을 브라우저 로컬 중심으로 실행하고 기록하는 정적 Web/PWA입니다. 사용자는 루틴을 선택하고 단계별 타이머를 따라가며, 필요할 때만 MediaPipe Face Landmarker 기반 참고 동선 표시를 사용할 수 있습니다.

## What Is New In This Submission Context

- 루틴 안내, 타이머, 기록, 백업/복원, 삭제를 하나의 PWA 흐름으로 제공
- 서버 계정 없이 현재 브라우저 중심으로 기록과 설정을 관리
- 사용자 선택형 카메라/업로드 흐름에서 참고 동선을 표시
- QA-only reference mode와 real MediaPipe production path를 명확히 분리
- static web package로 QR, 태블릿, 모바일 브라우저 데모에 맞게 준비 가능

## On-Device Fit

The current build uses browser-executed logic, local storage, service worker cache, and a local Face Landmarker model file. The face guide runtime is currently loaded from CDN, so a fully offline demo would require vendoring the runtime and rerunning QA.

## Evidence

- App build: `20260612a05`
- Real model QA: `output/playwright/20260610-real-model-check/metrics.json`
- QA status: `passed`
- Production criteria: `provider=mediapipe`, `detectorSource=real`, `source=upload-landmark`, `referenceOnly=false`, `containsMock=false`
- Web release zip SHA-256: `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0`

## Submission Boundary

This is a general beauty self-care PWA submission draft. It does not claim official approval, selection, certification, public launch, or guaranteed outcomes.

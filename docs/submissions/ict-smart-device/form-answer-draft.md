# ICT Smart Device Form Answer Draft

작성 기준: 2026-06-10 KST

## Official Web Form Field Map

| Official Field | Draft / Status |
| --- | --- |
| 분야 구분 | TODO: owner selects `기업` or `일반` |
| 암호설정 | TODO: owner creates password with letters and numbers, 6+ characters |
| 참가자 대표 | TODO: owner input |
| 휴대폰 번호 | TODO: owner input |
| 이메일 | TODO: owner input |
| 아이템명 | 괄사 루틴 |
| 아이템 설명, 200자 이내 | 브라우저 로컬에서 루틴 타이머, 기록, 백업/삭제, MediaPipe Face Landmarker 기반 참고 동선 표시를 제공하는 일반 뷰티 셀프케어 PWA입니다. |
| 신청서 업로드 | TODO: complete official HWP or PDF application form, file name per official category rule |
| 공모전 약관/동의서 확인 | TODO: owner review and consent |
| 최종 내용 확인 | TODO: owner review and consent |

## Project Name

괄사 루틴

## One-Line

브라우저 로컬에서 루틴 타이머, 기록, 백업/삭제, MediaPipe Face Landmarker 기반 참고 동선 표시를 제공하는 일반 뷰티 셀프케어 PWA입니다.

## 100-Character Version

브라우저 로컬에서 괄사 루틴, 타이머, 기록, MediaPipe 기반 참고 동선 표시를 제공하는 뷰티 셀프케어 PWA.

## 300-Character Version

괄사 루틴은 브라우저 안에서 실행되는 일반 뷰티 셀프케어 PWA입니다. 사용자는 루틴을 고르고 단계별 타이머를 따라가며 현재 브라우저에 기록을 남길 수 있습니다. 선택형 얼굴 참고 가이드는 MediaPipe Face Landmarker 기반으로 카메라 또는 업로드 이미지 위에 참고 동선을 표시합니다.

## 500-Character Version

괄사 루틴은 정적 Web/PWA 구조로 만든 일반 뷰티 셀프케어 앱입니다. 루틴 안내, 단계별 타이머, 로컬 기록, 사진 메모, 백업/복원, 리마인더를 제공하고, 선택형 얼굴 참고 가이드는 사용자가 직접 선택한 카메라 또는 업로드 이미지 위에 참고 동선을 표시합니다. 현재 구현은 서버 계정 없이 현재 브라우저에 데이터를 저장하며, production QA는 real MediaPipe Face Landmarker 흐름에서 `referenceOnly=false`, `detectorSource=real`, `source=upload-landmark`로 통과했습니다.

## 1000-Character Version

괄사 루틴은 일반 뷰티 셀프케어 사용자를 위한 정적 Web/PWA 서비스입니다. 사용자는 루틴을 선택하고 단계별 타이머를 따라가며, 완료 후 현재 브라우저에 기록과 사진 메모를 남길 수 있습니다. 설정, 커스텀 루틴, 리마인더, 백업/복원, 삭제/초기화 흐름도 브라우저 로컬 중심으로 구성되어 있습니다.

선택형 얼굴 참고 가이드는 사용자가 카메라 또는 업로드를 직접 선택했을 때만 실행됩니다. 이 기능은 MediaPipe Face Landmarker 결과를 바탕으로 화면 위에 참고 동선을 표시하는 보조 기능이며, 원본 얼굴 이미지를 서버로 전송하거나 지속적인 얼굴 템플릿을 만드는 방식으로 설명하지 않습니다.

현재 build `20260612a05`는 real MediaPipe upload flow에서 `provider=mediapipe`, `detectorSource=real`, `source=upload-landmark`, `referenceOnly=false`, `containsMock=false` 조건으로 QA를 통과했습니다. mock/reference 경로는 QA 전용이며 production 성공 기준으로 제출하지 않습니다. 본 앱은 의료 목적 아님, 보장 불가 범위의 일반 뷰티 셀프케어 PWA로만 설명합니다.

## Problem Definition

일상 뷰티 셀프케어 루틴은 사용자가 순서, 시간, 기록 방식을 스스로 관리해야 해서 꾸준히 따라가기 어렵습니다. 특히 모바일 환경에서는 루틴 안내, 타이머, 기록, 백업, 참고 동선 확인이 서로 흩어지기 쉽습니다. 괄사 루틴은 이 흐름을 하나의 브라우저 기반 PWA 안에서 간단히 실행하고 기록할 수 있게 만드는 데 초점을 둡니다.

## Solution

괄사 루틴은 설치 부담이 낮은 정적 Web/PWA로 루틴 선택, 단계별 타이머, 완료 기록, 사진 메모, 로컬 백업/복원, 리마인더를 제공합니다. 얼굴 참고 가이드는 사용자가 직접 선택한 카메라 또는 업로드 이미지에서 참고 동선을 표시하는 보조 기능으로 제한합니다. 서버 계정 없이 현재 브라우저를 중심으로 동작해 데모와 배포가 단순합니다.

## Core Features

- 루틴 선택과 단계별 타이머
- 완료 기록과 사진 메모
- 커스텀 루틴과 설정
- 로컬 백업, 복원, 삭제, 초기화
- 사용자 선택형 리마인더
- MediaPipe Face Landmarker 기반 참고 동선 표시
- 로컬 정책/지원 안내 페이지

## Technical Differentiation

- HTML, CSS, vanilla JavaScript 기반의 정적 PWA
- 현재 브라우저 중심의 `localStorage` 기록 관리
- service worker 캐시와 Web App Manifest
- 로컬 모델 파일 `assets/models/face-landmarker/face-landmarker.task`
- MediaPipe Tasks Vision runtime을 필요 시 로드하는 얼굴 참고 가이드
- real MediaPipe production QA 기준을 별도 기록
- QA-only mock/reference 경로와 production 성공 기준 분리

## Technology Used

- Web/PWA: HTML, CSS, vanilla JavaScript
- Storage: browser `localStorage`
- Offline shell: service worker cache
- Install metadata: Web App Manifest
- Face guide: MediaPipe Face Landmarker
- QA: Playwright-based checks and packaged release evidence

## Privacy Approach

현재 구현 기준으로 백엔드, 계정, 분석 SDK, 광고 SDK, 결제 SDK가 없습니다. 루틴 기록과 설정은 현재 브라우저에 저장됩니다. 백업 파일은 사용자가 직접 생성할 때만 만들어집니다. 카메라/업로드 흐름은 사용자가 선택한 경우에만 실행되며, 얼굴 참고 가이드는 브라우저 안에서 참고 동선 표시용으로만 설명합니다.

## Safety And Disclaimer Policy

제출 문구는 일반 뷰티 셀프케어 PWA 범위로 유지합니다. 얼굴 참고 가이드는 참고 동선 표시용 보조 기능이며, 의료 목적 아님, 보장 불가 범위로 설명합니다. 외모 변화 약속, 전후 변화 단정, 사용자 상태 평가처럼 읽히는 문구는 제출 자료에 쓰지 않습니다.

## Current Development Stage

build `20260612a05` 기준으로 Web/PWA release package와 store asset package가 생성되어 있습니다. 최신 real-model QA는 `output/playwright/20260610-real-model-check/metrics.json`에서 `passed`입니다. 다만 공식 공모전 제출용 최종 HWP/PDF 신청서, 대표자 정보, 연락처, 서명, 동의 항목은 아직 owner input이 필요합니다.

## Validation Result

- App build: `20260612a05`
- Web release zip: `output/release/gwalsa-web-pwa-20260610-100147.zip`
- Web release SHA-256: `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0`
- Store asset zip: `output/store-assets/gwalsa-store-assets-20260610-100154.zip`
- Store asset SHA-256: `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4`
- Real model QA: `provider=mediapipe`, `detectorSource=real`, `source=upload-landmark`, `referenceOnly=false`, `containsMock=false`

## Expected Value

괄사 루틴은 사용자가 셀프케어 루틴의 순서와 시간을 이해하고, 기록을 현재 브라우저에서 관리할 수 있게 돕습니다. 공모전 관점에서는 브라우저 로컬 처리, PWA 배포, 사용자 선택형 참고 동선 표시, 개인정보 최소화 방향을 한 흐름으로 시연할 수 있습니다.

## Commercialization Plan Draft

초기 단계에서는 Web/PWA 데모와 정적 호스팅 배포로 검증합니다. 이후 사용성 피드백을 바탕으로 루틴 콘텐츠, 디바이스 데모, 완전 오프라인 런타임, 네이티브 래퍼 또는 미니앱 포팅 가능성을 검토합니다. 유료화나 계정 기능을 추가할 경우 개인정보, 결제, 약관, QA 문서를 다시 작성해야 합니다.

## Future Expansion Plan

- MediaPipe Tasks Vision JS/WASM runtime vendoring for fully offline demos
- Public HTTPS hosting and QR demo page
- Target-device camera/upload compatibility QA
- Official HWP/PDF application completion
- Optional native wrapper or miniapp review after data-flow documentation
- Accessibility and low-end device performance checks

## Team Capability

TODO: owner should add team or applicant capability. Repository-based evidence only supports the current build, QA, release packaging, screenshots, and submission drafts. Do not invent founder history, revenue, user count, awards, patents, or partner claims.

## Keywords

일반 뷰티 셀프케어 PWA, 브라우저 로컬 처리, 지능 온디바이스, MediaPipe Face Landmarker, 참고 동선 표시, 루틴 타이머, 로컬 기록, 백업/복원, 정적 웹 앱

## Category Candidate

- Official category: TODO, owner selects `기업` or `일반`
- Product angle: 지능 온디바이스 아이디어 및 기술, browser-local software demo
- Device demo target: TODO, owner confirms target phone/tablet/browser

## Copy Caution

Use only general beauty self-care wording. Do not write claims that say or imply medical use, diagnosis, treatment, disease prevention, guaranteed results, appearance-change promises, or confirmed before/after changes. MediaPipe and AI-style wording must remain a technical/reference support explanation only.

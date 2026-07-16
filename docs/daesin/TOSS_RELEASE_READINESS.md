# DAESIN · 토스 미니앱 출시 준비 현황

기준일: 2026-07-15 · 대상: `apps-in-toss/daesin`

## 준비 완료

- `daesin`이라는 고정 앱 이름으로 Apps-in-Toss Web Framework 설정을 구성했다.
- 비게임 앱에 필요한 TDS Mobile의 `TDSMobileProvider`, `Button`, `TextField`를 실제 화면에 사용했다.
- 성인 확인 → 음식 입력 → 배고픔 선택 → 세 가지 선택 → 5분 타이머/완료의 핵심 흐름을 테스트했다.
- AIT 빌드, 타입 검사, 범위 검사, 단위/스모크 테스트가 통과했다.
- 토스 콘솔용 이름·설명·아이콘 경로·자산 규격·지원/법적 URL 입력칸을 `console/metadata.json`에 정리했다.

## 빌드 증빙

- 최신 AIT: `daesin.ait` · 5,198,718 bytes
- 압축 해제 크기: 24,192,326 bytes (토스 100MB 제한 이내)
- SHA-256: `34a49ba4a4a09f2573fa3c74acdbad37dae22889141ff072cbea2b58abda646b`
- 묶음 검증: 생성된 릴리스 후보 ZIP의 `unzip -t`가 통과했다.

## 제출 전 사람이 확정할 항목

1. 토스 콘솔에서 `daesin` 앱을 등록한다. 앱 이름은 등록 후 변경할 수 없으므로 콘솔 표기와 설정을 일치시킨다.
2. 준비된 `console/daesin-app-icon-600.png`를 공개 HTTPS에 업로드한다. 현재 설정된 예정 URL은 아직 404이므로, 업로드 후 200 응답을 확인한다.
3. 실제 소유 고객 문의 이메일·전화번호·채팅 URL을 입력한다.
4. 운영자, 시행일, 공개 HTTPS 개인정보처리방침 및 이용약관 URL을 확정한다. `console/PRIVACY_POLICY_KO.md`는 현재 AIT 동작에 맞춘 초안이며, 기존 제품 전체용 `PRIVACY.md`는 계정·AI·구독 등 이 후보에 없는 기능을 설명하므로 그대로 공개하지 않는다.
5. 1932×828 PNG 썸네일과 토스 규격의 최종 스크린샷을 실제 AIT 화면에서 캡처한다. 기존 `assets/daesin/store` 이미지는 참고용이며 규격 제출본이 아니다.
6. 토스 앱에 로그인한 19세 이상 워크스페이스 구성원이 콘솔 QR로 AIT를 최소 한 번 실행한다.
7. 해당 테스트가 완료된 뒤에만 콘솔에서 심사 요청을 제출한다.

## 안전한 출시 경계

- 현재 후보는 회원가입·로그인·결제·광고·외부 AI·서버 전송을 포함하지 않는다.
- 의료·치료 서비스가 아니며, 의학적 판단이나 식이 처방을 제공하지 않는다.
- AIT 생성 및 로컬 QA까지만 완료했다. 콘솔 등록·QR 실기기 테스트·심사 요청·공개 출시는 소유자의 외부 실행이 필요하므로 자동으로 수행하지 않았다.

## 공식 근거

- [AIT 배포와 100MB 제한](https://developers-apps-in-toss.toss.im/development/deploy.md)
- [토스 앱 QR 테스트 절차](https://developers-apps-in-toss.toss.im/development/test/toss.md)
- [콘솔 앱 등록과 운영자 정보](https://developers-apps-in-toss.toss.im/prepare/console-workspace.md)

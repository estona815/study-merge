# 대신 · Apps-in-Toss 출시 후보

배달·야식 충동을 잠깐 멈추고 세 가지 선택지를 고르는, 19세 이상용 비게임 미니앱입니다. 입력값과 선택 결과는 서버로 전송하지 않으며 현재 기기 화면 흐름에서만 사용합니다.

## 실행 및 검증

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm ait:build
```

로컬 미리보기는 `pnpm dev`로 열 수 있습니다. 토스 앱 실기기 테스트와 콘솔 심사 요청은 소유자가 콘솔에서 진행해야 합니다.

## 출시 범위

- TDS Mobile의 `TDSMobileProvider`, `Button`, `TextField`를 실제 사용합니다.
- 회원가입·로그인·결제·광고·의료 진단 기능을 포함하지 않습니다.
- 비게임 미니앱 콘솔 입력값과 남은 사람 확인 항목은 `console/metadata.json` 및 `console/README.md`에 정리했습니다.

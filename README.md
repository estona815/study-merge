# Study Merge

Study Merge는 개념 블록을 밀고 합치며 퀴즈로 확인하는 모바일 학습 게임 MVP입니다.
Expo + React Native 기반으로 작성되었고, 게임 로직과 학습 데이터 구조를 분리해
과목 확장과 추후 서버 연동이 가능한 형태로 설계했습니다.

## 현재 구현 범위

- 고등학교 12과목, 자격증 10과목 샘플 과목
- 과목 선택, 단원 선택, 복습 큐, 통계, 결과 화면
- 4x4 또는 5x5 개념 블록 보드
- 합성 후 OX, 객관식, 빈칸, 짝맞추기 퀴즈
- 오답 큐, 숙련도 반영, 로컬 통계 저장
- 웹에서는 방향키 조작 지원

## 기술 스택

- Expo + React Native + TypeScript
- Zustand
- AsyncStorage
- Node 내장 test runner + `tsx`

## 실행 및 검증

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm validate:content
pnpm doctor
pnpm check
pnpm web:export
```

## 출시 직전 기준에서 남은 것

- 실제 교육과정, 자격 출제 기준, 저작권 검토 반영
- 실제 서비스용 과목 데이터 확장
- 앱 아이콘, 스플래시, 스토어 등록 자산 제작
- iOS/Android 실기기 QA
- 번들 ID, 패키지명, 배포 계정 정보 확정
- release metadata(`sourceRef`, `reviewStatus`, `copyrightStatus`) 채우기

## 콘텐츠 주의

이 저장소의 개념, 설명, 퀴즈는 MVP 프로토타입용 샘플 데이터입니다.
실서비스 전에는 공식 교육과정, 자격 기준, 저작권 검토를 반드시 진행해야 합니다.

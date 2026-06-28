# Study Merge Release QA Checklist

이 문서는 `Study Merge` 실제 릴리즈 전 수동 QA 체크리스트다. 테스트 통과만으로는 충분하지 않으며, 아래 항목을 실기기와 웹에서 직접 확인해야 한다.

## 사용법

- 각 항목은 `Pass`, `Fail`, `Blocked`, `N/A` 중 하나로 기록한다.
- `Fail` 는 재현 단계와 화면/기기 정보를 함께 적는다.
- 세션 복구, 타이머, 복습 큐, 결과 화면은 반드시 영상 또는 스크린샷 증빙을 남긴다.

## 추천 기기 매트릭스

- Small iPhone: iPhone SE 2세대급 또는 375pt 폭
- Modern iPhone: Dynamic Island 계열 iPhone 14/15/16급
- iPad or tablet: iPad mini 또는 768pt 이상
- Low-end Android: 4GB RAM급 보급형 Android
- Mid-range Android: 6GB RAM 이상 Android
- Web desktop browser: Chrome 최신 안정 버전, Safari 또는 Edge 1종 추가

## First Launch / Navigation

- `First launch`
  - 앱 첫 실행 시 크래시 없이 온보딩으로 진입하는가
  - 첫 프레임에서 다른 앱 또는 legacy 화면이 뜨지 않는가
- `Onboarding`
  - 학습 트랙, 목표, 난이도 선택이 정상 동작하는가
  - 선택값이 카테고리 허브에 반영되는가
- `Category hub`
  - 고등학교 / 자격증 / 오늘 복습 / 오답 정리 / 약점 보완 / 3분 퀵런 / 시험 직전 카드가 모두 열리는가
- `Subject search/filter`
  - 검색 입력 시 결과가 정상 축소되는가
  - 필터 변경 후 과목 수가 맞게 바뀌는가
  - 검색 결과 0건 상태 문구가 자연스러운가
- `Unit selection`
  - 단원 목록, 중요도, 개념 수, 퀴즈 수, 숙련도가 표시되는가
  - 난이도 변경 후 시작 시 4x4 / 5x5 규칙이 맞게 반영되는가

## Core Gameplay

- `4x4 board`
  - 쉬움/보통/시험직전에서 4x4 보드가 맞게 열리는가
- `5x5 board`
  - 어려움에서 5x5 보드가 맞게 열리는가
- `Swipe controls`
  - iOS/Android 스와이프 방향 인식이 안정적인가
  - 짧은 터치가 오작동으로 이동되지 않는가
- `Button controls`
  - 하단 방향 버튼이 모두 반응하는가
- `Keyboard controls on web`
  - 방향키 입력이 정상 반응하는가
  - 포커스가 다른 입력창에 있지 않을 때만 플레이 의도대로 동작하는가
- `Concept merge`
  - 유효한 관련 개념 또는 같은 그룹 개념이 합성되는가
  - 합성 후 퀴즈가 열리고 합성이 학습 확정 흐름으로 이어지는가
- `Invalid merge`
  - 합칠 수 없는 블록에서는 보드가 깨지지 않는가
  - 중복 타일, 빈칸 오염, 순서 꼬임이 없는가
- `Hint behavior`
  - 쉬움 모드에서 관련 개념 힌트가 자연스럽게 보이는가
  - 어려움/시험직전에서는 힌트가 과도하게 노출되지 않는가
- `Concept explanation behavior`
  - 합성 대기 중 또는 최근 학습 개념에 대한 설명이 맞게 표시되는가
- `Combo behavior`
  - 정답 시 콤보가 증가하고 오답 시 초기화되는가
- `Timer behavior`
  - 플레이 중 1초 단위로 감소하는가
  - 퀴즈 대기 상태에서는 타이머가 멈추는가
- `Pause/resume`
  - 일시정지 시 이동과 타이머가 멈추는가
  - 이어하기 시 다시 정상 재개되는가
- `App background/foreground`
  - 백그라운드 또는 비활성화 전환 시 자동 일시정지되는가
  - 복귀 시 타이머가 몰래 줄어들지 않았는가
- `Persisted session restore`
  - 앱 종료 후 재실행 시 진행 중 세션이 복구되는가
- `Restored session paused=true`
  - 복구 직후 `paused=true` 상태로 시작하는가
  - 사용자가 직접 이어하기를 누르기 전 타이머가 감소하지 않는가

## Quiz Coverage

- `OX quiz`
  - O/X 선택, 제출, 피드백, 다음 진행이 모두 정상인가
- `Multiple choice quiz`
  - 선택지 선택과 정답 판정이 정상인가
- `Blank quiz`
  - 공백/대소문자 차이에서 허용 정책이 의도대로 동작하는가
- `Matching quiz`
  - 각 left 항목마다 답을 선택할 수 있는가
  - 잘못된 매칭이 정답 처리되지 않는가

## Result / Review / Stats

- `Result screen`
  - 점수, 정답/오답, 최고 콤보, 학습 개념 수, 추천 행동이 모두 표시되는가
- `Review queue`
  - 오답 시 복습 큐에 정상 추가되는가
  - 복습 재시작과 큐 제거가 정상 동작하는가
- `Stats screen`
  - 총 학습 시간, 정답/오답, 연속 학습일, 과목별 숙련도, 최근 세션이 정상 집계되는가

## Layout / Accessibility / Performance

- `Safe area on small iPhone`
  - 상단 헤더, 보드, 퀴즈 모달, 하단 버튼이 잘리지 않는가
- `Safe area on modern iPhone`
  - Dynamic Island / 홈 인디케이터 영역과 충돌하지 않는가
- `Android gesture navigation`
  - 하단 제스처 영역과 버튼이 과도하게 겹치지 않는가
- `Low-end Android performance`
  - 초기 진입, 과목 필터, 보드 이동, 퀴즈 모달 표시가 체감상 버벅이지 않는가
- `30-minute continuous session`
  - 장시간 플레이 중 세션 꼬임, 타이머 비정상, 메모리 급증이 없는가
- `Memory growth observation`
  - 장시간 플레이 후 앱이 강제 종료되거나 심한 프레임 저하가 없는가
- `Offline behavior`
  - 네트워크 없이도 온보딩, 과목 탐색, 게임, 복습, 통계가 모두 동작하는가
- `Web export smoke test`
  - `pnpm web:export` 산출물로 기본 진입과 방향키 플레이가 가능한가
- `Font scale`
  - 큰 글자 크기에서도 보드/퀴즈/결과 화면이 깨지지 않는가
- `Color contrast`
  - 힌트, badge, 결과 피드백 박스가 충분히 읽히는가
- `Reduced motion`
  - 강한 애니메이션 의존이 없어 접근성 설정과 충돌하지 않는가
- `Touch target size`
  - 방향 버튼, 답안 버튼, CTA가 최소 터치 타깃에 가까운가

## Store / Privacy / Content Gates

- `Store metadata readiness`
  - 앱 이름, 설명, 스크린샷, 아이콘, 스플래시, 카테고리, 리뷰 노트 준비 여부 확인
- `Privacy/data-safety readiness`
  - 로컬 저장 데이터와 전송 데이터 설명이 문서화되었는가
- `Content accuracy review`
  - 공식 교육과정/자격 시험 기준 검수 증빙이 있는가
- `Copyright review`
  - 교재/기출/저작물 전재 위험 검토가 끝났는가

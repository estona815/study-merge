# DAESIN Connector Map

| 도구 | 상태 | 이번 사용 | 로컬 fallback |
| --- | --- | --- | --- |
| 파일 시스템 / shell | 사용 가능 | 저장소 진단, 구현, 검증 | 없음 |
| Image Gen | 사용 가능 | 미사용: 기존 로컬 래스터 자산을 보존 | 코드 토큰과 단순 벡터 명세 |
| In-app Browser | 사용 가능 | web 렌더링·상호작용 QA | repo Playwright 설정 |
| Figma | 인증됨, 보기 전용 | 새 파일 작성 불가; 로컬 원본 감사만 수행 | 코드 토큰 + PNG 콘셉트 + UX spec |
| GitHub | 인증됨 | 원격 변경은 하지 않고 schedule source만 로컬 작성 | 로컬 git diff/status |
| Google Drive / Notion | 사용 가능 | 미사용: 관련 외부 문서를 지정받지 않음 | `docs/daesin` |
| Apps-in-Toss docs | 사용 가능 | 필요 시 패키징 단계에서만 사용 | 기존 Expo web export |
| Supabase SDK | 로컬 의존성 존재, connector/CLI 없음 | adapter·worker·migration/RLS source 작성(미적용) | mock repository |
| iOS Simulator | 감지 안 됨 | 미실행 | web + 정적 config + 실행 절차 |
| Android Emulator | 감지 안 됨 | 미실행 | web + 정적 config + 실행 절차 |

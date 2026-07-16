# DAESIN ASO Validation Notes

- 검증일: 2026-07-15
- 범위: 공식 스토어 메타데이터 한도와 현재 한국어 초안의 정적 길이
- 한계: 한국 storefront 검색량·경쟁 강도·전환율은 실제 콘솔 또는 ASO 데이터로 검증하지 않았다.

## 공식 제약

- Apple App Store: 앱 이름 30자, 부제 30자, 키워드 총 100자. 키워드는 쉼표로 구분하고 앱 이름·부제의 단어를 반복하지 않는다. 출처: [Apple product page](https://developer.apple.com/app-store/product-page/), [App Store search](https://developer.apple.com/app-store/search/)
- Google Play: 앱 이름 30자, 짧은 설명 80자, 전체 설명 4,000자. 출처: [Play Console store listing](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en-EN)

## 현재 초안 정적 검사

| 필드 | 길이 | 한도 | 결과 |
|---|---:|---:|---|
| 앱 이름 `대신 – 야식·배달 충동 브레이크` | 18자 | 30자 | 통과 |
| 부제 `결제 전 5분, 내 선택을 되찾는 시간` | 21자 | 30자 | 통과 |
| Google Play 짧은 설명 | 44자 | 80자 | 통과 |
| Apple 키워드 초안 | 43자 | 100자 | 통과 |

제출 전 실제 한국 storefront에서 `야식`, `배달`, `식습관`, `감정 기록` 검색 결과와 상표 충돌을 다시 확인하고, 스토어 상세→설치와 설치→24시간 활성화를 함께 판정한다.

#!/usr/bin/env python3
"""Fill the official 2026 ICT Smart Device general application draft."""

from __future__ import annotations

from copy import deepcopy
from datetime import date
from pathlib import Path

from docx import Document


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "output/submission/ict-smart-device/official-forms/application-general.docx"
OUT_DIR = ROOT / "output/submission/ict-smart-device/final-upload"
OUT_DOCX = OUT_DIR / "권준.docx"

APPLICANT = {
    "category": "일반",
    "team_name": "괄사 루틴 팀",
    "representative": "권준",
    "phone": "010-2445-0551",
    "email": "kwonj0815@naver.com",
    "item_name": "괄사 루틴",
    "today": "2026년 6월 10일",
}


def set_cell(cell, text: str) -> None:
    cell.text = text


def append_paragraph(cell, text: str) -> None:
    if cell.paragraphs and not cell.paragraphs[0].text.strip():
        cell.paragraphs[0].text = text
    else:
        cell.add_paragraph(text)


def replace_in_cell(cell, replacements: dict[str, str]) -> None:
    for paragraph in cell.paragraphs:
        for run in paragraph.runs:
            text = run.text
            for old, new in replacements.items():
                text = text.replace(old, new)
            run.text = text


def add_section_text(cell, heading: str, body: str) -> None:
    set_cell(cell, f"{heading}\n\n{body}")


def copy_row(table, row_index: int):
    row = table.rows[row_index]
    new_tr = deepcopy(row._tr)
    table._tbl.append(new_tr)
    return table.rows[-1]


def remove_row(table, row_index: int) -> None:
    row = table.rows[row_index]
    table._tbl.remove(row._tr)


def strip_instruction_paragraphs(doc: Document) -> None:
    markers = (
        "작성안내문구",
        "본 신청서는 아이디어의 타당성",
        "구체적인 알고리즘",
        "제출된 아이디어의 권리는",
        "이미지, 도표는 자유롭게",
        "본 공모전 출품 아이디어와 유사한",
        "필요한 경우 칸을 추가",
        "참가자 대표 1인만 작성",
        "연락처 정보를 기재",
    )
    for paragraph in list(doc.paragraphs):
        text = paragraph.text.strip()
        if text.startswith("※") or text.startswith("*") or any(marker in text for marker in markers):
            paragraph._element.getparent().remove(paragraph._element)


def fill_application() -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = Document(str(TEMPLATE))
    strip_instruction_paragraphs(doc)

    # Front page.
    table = doc.tables[1]
    set_cell(table.rows[2].cells[1], APPLICANT["item_name"])
    set_cell(table.rows[3].cells[1], "")

    applicant_table = doc.tables[2]
    set_cell(applicant_table.rows[0].cells[1], APPLICANT["team_name"])
    set_cell(applicant_table.rows[2].cells[2], APPLICANT["representative"])
    set_cell(applicant_table.rows[2].cells[4], APPLICANT["phone"])
    set_cell(applicant_table.rows[3].cells[2], APPLICANT["representative"])
    set_cell(applicant_table.rows[3].cells[4], APPLICANT["email"])
    set_cell(
        applicant_table.rows[4].cells[0],
        "신청인은 위 아이디어로 「2026년 ICT 스마트 디바이스 전국 공모전」에 성실히 참여하고자 아래 서류와 함께 신청서를 제출합니다.\n\n"
        "붙임 1. ICT 스마트 디바이스 전국 공모전 출품 아이디어 상세내용 1부.\n"
        "2. 2026년 ICT 스마트 디바이스 전국 공모전 참가 약관(서명본) 1부.\n"
        "3. 2026년 ICT 스마트 디바이스 전국 공모전 참가 동의서 1부.\n"
        "4. 2026년 ICT 스마트 디바이스 전국 공모전 참가자 개인정보 수집ㆍ이용ㆍ제공 동의서 1부. 끝.\n\n"
        f"{APPLICANT['today']}\n\n참가자 대표 : {APPLICANT['representative']} (인)\n\n"
        "2026년 ICT 스마트 디바이스 전국 공모전 운영사무국 스마트기술진흥협회 귀하",
    )

    summary = doc.tables[4]
    set_cell(summary.rows[0].cells[1], APPLICANT["item_name"])
    set_cell(summary.rows[1].cells[1], "")
    set_cell(
        summary.rows[2].cells[1],
        "☑ 기존 상용 디바이스에 SW만 탑재하여 아이디어 구현 (APP, 솔루션 등)\n"
        "□ 전용 디바이스 개발\n"
        "□ 기타",
    )
    set_cell(
        summary.rows[3].cells[1],
        "☑ MVP개발 중 (정적 Web/PWA build 20260612a05, real MediaPipe QA 통과)\n"
        "□ 아이디어 단계\n"
        "□ 알파ㆍ베타테스트",
    )

    detail = doc.tables[5]
    set_cell(detail.rows[0].cells[0], "1. 아이디어의 필요성")
    add_section_text(
        detail.rows[1].cells[0],
        "1. 아이디어의 필요성",
        "일상 뷰티 셀프케어 루틴은 사용자가 순서, 시간, 기록 방식을 스스로 관리해야 해서 꾸준히 따라가기 어렵다. "
        "특히 모바일 환경에서는 루틴 안내, 타이머, 기록, 백업, 참고 동선 확인이 서로 흩어지기 쉽다. "
        "괄사 루틴은 이 흐름을 하나의 브라우저 기반 PWA 안에서 간단히 실행하고 기록할 수 있게 만드는 일반 뷰티 셀프케어 서비스다.\n\n"
        "본 아이디어는 서버 계정 없이 현재 브라우저 중심으로 동작하는 구조를 지향한다. 사용자는 루틴을 선택하고, 단계별 타이머를 따라가며, "
        "완료 후 기록과 사진 메모를 남길 수 있다. 얼굴 참고 가이드는 사용자가 직접 선택한 카메라 또는 업로드 이미지 위에 참고 동선을 표시하는 보조 기능으로 제한한다.",
    )
    set_cell(detail.rows[2].cells[0], "2. 아이디어 개요 및 작동 원리")
    add_section_text(
        detail.rows[3].cells[0],
        "2. 아이디어 개요 및 작동 원리",
        "괄사 루틴은 HTML, CSS, vanilla JavaScript로 구현된 정적 Web/PWA이다. 앱은 루틴 안내, 단계별 타이머, 로컬 기록, 사진 메모, "
        "백업/복원, 리마인더, 선택형 얼굴 참고 가이드를 제공한다. 데이터는 현재 브라우저의 localStorage를 중심으로 저장되며, 백업 파일은 사용자가 직접 생성할 때만 만들어진다.\n\n"
        "온디바이스 적용 관점에서, 얼굴 참고 가이드는 MediaPipe Face Landmarker 기반으로 브라우저 안에서 실행되는 참고 동선 표시 흐름이다. "
        "현재 build 20260612a05의 production QA는 real MediaPipe upload flow에서 provider=mediapipe, detectorSource=real, "
        "source=upload-landmark, referenceOnly=false, containsMock=false 조건으로 통과했다. QA-only mock/reference 경로는 운영 성공 기준으로 사용하지 않는다.\n\n"
        "클라우드 서버 없이 브라우저 로컬 중심으로 처리하면 사용자가 선택한 입력과 기록의 범위를 더 명확히 제어할 수 있고, 데모 환경에서는 QR 또는 URL로 빠르게 실행할 수 있다. "
        "현재 Face Landmarker 모델 파일은 앱 자산에 포함되어 있으며, MediaPipe Tasks Vision JS/WASM runtime은 CDN에서 필요 시 로드한다. 완전 오프라인 시연을 위해서는 runtime vendoring 후 재검증한다.",
    )
    set_cell(detail.rows[4].cells[0], "3. 혁신성 및 차별성")
    add_section_text(
        detail.rows[5].cells[0],
        "3. 혁신성 및 차별성",
        "괄사 루틴의 차별점은 뷰티 셀프케어 루틴, 타이머, 기록, 백업/삭제, 참고 동선 표시를 하나의 정적 PWA 흐름으로 묶은 데 있다. "
        "일반적인 루틴 메모나 타이머 앱은 얼굴 참고 동선과 로컬 기록 관리를 함께 제공하지 않는 경우가 많고, 영상 기반 콘텐츠는 사용자의 기록/백업/삭제 흐름과 분리되어 있다.\n\n"
        "본 서비스는 서버 계정, 분석 SDK, 광고 SDK, 결제 SDK 없이 현재 브라우저를 중심으로 동작한다. 얼굴 참고 가이드는 사용자 선택형이며, 사람 식별이나 지속적인 얼굴 템플릿 생성을 전제로 하지 않는다. "
        "제출 자료에서는 일반 뷰티 셀프케어 PWA 범위를 유지하고, 의료 목적이나 확정적 결과 표현을 사용하지 않는다.",
    )
    set_cell(detail.rows[6].cells[0], "4. 목표시장 및 사업화 모델")
    add_section_text(
        detail.rows[7].cells[0],
        "4. 목표시장 및 사업화 모델",
        "초기 목표 사용자는 모바일 브라우저로 짧은 뷰티 셀프케어 루틴을 따라가고 기록하려는 일반 사용자다. "
        "초기 검증은 정적 Web/PWA 데모와 QR 기반 접근으로 진행하고, 사용성 피드백을 바탕으로 루틴 콘텐츠, 오프라인 시연, 미니앱 또는 네이티브 래퍼 가능성을 검토한다.\n\n"
        "사업화 모델은 초기에는 무료 Web/PWA 데모와 파트너십 검토 중심으로 설정한다. 향후 유료 콘텐츠, 구독, B2B 라이선스, 디바이스 연계 등은 개인정보, 결제, 약관, QA 범위를 새로 문서화한 뒤 검토한다. "
        "현재 제출 단계에서는 사용자 수, 매출, 수상, 인증, 제휴를 확정적으로 주장하지 않는다.",
    )
    set_cell(detail.rows[8].cells[0], "5. 개발 진행 현황 및 계획")
    add_section_text(
        detail.rows[9].cells[0],
        "5. 개발 진행 현황 및 계획",
        "현재 build 20260612a05 기준 Web/PWA release package와 store asset package가 생성되어 있다. "
        "Web release zip은 output/release/gwalsa-web-pwa-20260610-100147.zip이며 SHA-256은 4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0이다. "
        "최신 real-model QA evidence는 output/playwright/20260610-real-model-check/metrics.json이고 status는 passed이다.\n\n"
        "향후 계획은 1단계로 안정적인 HTTPS 데모 URL 배포와 QR 테스트를 진행하고, 2단계로 목표 디바이스/브라우저에서 카메라 권한, 업로드 fallback, 서비스 워커 동작, 로컬 삭제/초기화 흐름을 확인한다. "
        "3단계에서는 완전 오프라인 시연이 필요할 경우 MediaPipe Tasks Vision runtime을 앱 자산에 포함하고 QA를 다시 수행한다. 4단계에서는 제출/심사 피드백에 따라 루틴 콘텐츠, 접근성, 저사양 기기 성능을 개선한다.",
    )

    awards = doc.tables[6]
    remove_row(awards, 1)
    set_cell(awards.rows[1].cells[0], "해당 없음")
    set_cell(awards.rows[1].cells[1], "해당 없음")
    set_cell(awards.rows[1].cells[2], "해당 없음")
    set_cell(awards.rows[1].cells[3], APPLICANT["team_name"])
    set_cell(awards.rows[1].cells[4], APPLICANT["item_name"])
    set_cell(awards.rows[1].cells[5], "유사 아이디어 수상 이력 없음")

    members = doc.tables[7]
    set_cell(members.rows[1].cells[1], APPLICANT["representative"])
    set_cell(members.rows[1].cells[2], "기획, 개발, QA, 제출 총괄")
    set_cell(members.rows[2].cells[1], "해당 없음")
    set_cell(members.rows[2].cells[2], "해당 없음")
    set_cell(members.rows[3].cells[1], "해당 없음")
    set_cell(members.rows[3].cells[2], "해당 없음")
    set_cell(members.rows[4].cells[1], "해당 없음")
    set_cell(members.rows[4].cells[2], "해당 없음")

    terms = doc.tables[8]
    append_paragraph(
        terms.rows[0].cells[0],
        f"\n본인은 위 「2026년 ICT 스마트 디바이스 전국 공모전 참가 약관」의 모든 조항을 확인하였으며, 이에 동의합니다.\n\n"
        f"{APPLICANT['today']}\n제안자 대표 (갑): {APPLICANT['representative']} (인)",
    )

    consent = doc.tables[9]
    set_cell(consent.rows[1].cells[1], APPLICANT["item_name"])
    set_cell(consent.rows[2].cells[1], APPLICANT["representative"])
    set_cell(consent.rows[2].cells[3], APPLICANT["team_name"])
    append_paragraph(
        consent.rows[3].cells[0],
        f"\n\n본인은 위 모든 조항을 확인하였으며, 이에 동의함을 서명으로 확인합니다.\n\n"
        f"{APPLICANT['today']}\n참가자 대표: {APPLICANT['representative']} (인)",
    )

    privacy = doc.tables[11]
    set_cell(privacy.rows[2].cells[1], "☑")
    set_cell(privacy.rows[2].cells[2], "")
    set_cell(privacy.rows[4].cells[2], "☑")
    set_cell(privacy.rows[4].cells[4], "")
    append_paragraph(
        privacy.rows[6].cells[0],
        f"\n\n본인은 상기 내용과 같이 개인정보를 수집·이용하고 제3자에게 제공하는데 동의합니다.\n\n"
        f"{APPLICANT['today']}\n신청자: {APPLICANT['representative']} (서명/인)",
    )

    doc.save(str(OUT_DOCX))
    return OUT_DOCX


if __name__ == "__main__":
    print(fill_application())

#!/usr/bin/env python3
"""Build small targeted PDF briefs for external submission routes."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = Path("/System/Library/Fonts/Supplemental/AppleGothic.ttf")


def register_font() -> str:
    if FONT_PATH.exists():
        pdfmetrics.registerFont(TTFont("AppleGothicLocal", str(FONT_PATH)))
        return "AppleGothicLocal"
    return "Helvetica"


FONT = register_font()
STYLES = getSampleStyleSheet()
BODY = ParagraphStyle(
    "BodyKo",
    parent=STYLES["BodyText"],
    fontName=FONT,
    fontSize=9.5,
    leading=13.6,
    alignment=TA_LEFT,
    wordWrap="CJK",
    spaceAfter=5,
)
SMALL = ParagraphStyle(
    "SmallKo",
    parent=BODY,
    fontSize=8.3,
    leading=11.8,
    textColor=colors.HexColor("#333333"),
)
TITLE = ParagraphStyle(
    "TitleKo",
    parent=BODY,
    fontName=FONT,
    fontSize=17,
    leading=22,
    alignment=TA_CENTER,
    spaceAfter=12,
)
H1 = ParagraphStyle(
    "H1Ko",
    parent=BODY,
    fontName=FONT,
    fontSize=12.3,
    leading=16,
    spaceBefore=8,
    spaceAfter=5,
)


def p(text: str, style: ParagraphStyle = BODY) -> Paragraph:
    escaped = (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )
    return Paragraph(escaped, style)


def kv(rows: list[tuple[str, str]]) -> Table:
    table = Table(
        [[p(k, SMALL), p(v, BODY)] for k, v in rows],
        colWidths=[38 * mm, 118 * mm],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#9AA5A0")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F3F6F4")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def add_page_number(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont(FONT, 8)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, str(doc.page))
    canvas.restoreState()


def build_pdf(path: Path, title: str, sections: list[tuple[str, str]], meta: list[tuple[str, str]]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=17 * mm,
        bottomMargin=17 * mm,
        title=title,
        author="Kwon Jun",
    )
    story = [p(title, TITLE), kv(meta), Spacer(1, 6)]
    for heading, body in sections:
        story.append(p(heading, H1))
        story.append(p(body))
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    return path


INBODYLIKE_SECTIONS = [
    (
        "Problem",
        "모바일에서 짧은 뷰티 셀프케어 루틴을 시작하려는 사용자는 순서, 시간, 기록, 백업을 각각 따로 챙기기 쉽습니다. "
        "오프라인 행사나 브랜드 경험에서도 QR로 바로 열리는 가벼운 루틴 도구가 있으면 접근 장벽을 낮출 수 있습니다.",
    ),
    (
        "Solution",
        "괄사 루틴은 브라우저에서 바로 실행되는 정적 PWA입니다. 사용자는 루틴을 고르고 단계별 타이머를 따라가며, 완료 기록과 사진 메모를 현재 브라우저에 남길 수 있습니다. "
        "선택형 참고 가이드는 사용자가 직접 고른 이미지 위에 참고 동선을 표시하는 보조 기능으로만 동작합니다.",
    ),
    (
        "Scale-up",
        "초기 검증은 공개 데모 URL과 QR 기반 접근, 로컬 기록, 간단한 루틴 완료 흐름을 중심으로 진행합니다. "
        "이후 브랜드 체험, 미니앱 포팅, 행사장 QR 시연, 루틴 콘텐츠 확장 순서로 작게 검증할 수 있습니다.",
    ),
    (
        "Team",
        "권준은 제품 기획, Web/PWA 개발, QA, 배포 패키지 관리, 외부 제출 패키지 정리를 담당하고 있습니다. "
        "현재 공개 가능한 범위에서는 1인 제품 빌드와 제출 운영 중심으로 소개하며, 추가 팀 정보는 후속 미팅에서 제공하겠습니다.",
    ),
    (
        "InBodyLIKE collaboration point",
        "라이프스타일 루틴 경험을 QR 기반으로 빠르게 열고, 사용자가 직접 선택한 루틴 완료 흐름을 가볍게 기록하는 PoC가 가능합니다. "
        "브랜드 체험 공간에서 루틴 안내, 타이머, 로컬 기록, 안내 콘텐츠를 하나의 모바일 흐름으로 테스트하는 방향을 제안합니다.",
    ),
    (
        "Build and QA basis",
        "기준 build는 20260612a05이며 service worker cache는 gwalsa-routine-v20260612a05입니다. "
        "최신 QA 근거는 output/playwright/20260610-real-model-check/metrics.json이고 status는 passed입니다. "
        "production 참고 동선 흐름은 provider=mediapipe, detectorSource=real, source=upload-landmark, referenceOnly=false, containsMock=false 기준입니다.",
    ),
]


GENERIC_SECTIONS = [
    (
        "Product",
        "Gwalsa Routine is a mobile-first PWA for everyday beauty self-care routines. Users can open it from a browser or QR link, choose a short routine, follow a step-by-step timer, and keep local records and photo notes in the current browser.",
    ),
    (
        "Current status",
        "The current baseline build is 20260612a05. The web release package and store asset package are fixed for this submission cycle. The latest production reference route QA status is passed.",
    ),
    (
        "Data direction",
        "The current implementation has no account system, no payment SDK, and no advertising SDK. Records are local-first, and backup/delete flows are controlled by the user.",
    ),
    (
        "Use cases",
        "The first review use cases are QR-based demo access, miniapp distribution review, brand or offline experience PoC, and lightweight routine habit tracking.",
    ),
]


def main() -> None:
    inbody_path = ROOT / "output/submission/inbodylike/final-upload/[사업계획서] 괄사루틴_권준.pdf"
    generic_path = ROOT / "output/submission/common/gwalsa-brief-safe-compact-20260610.pdf"
    build_pdf(
        inbody_path,
        "InBodyLIKE Submission Brief - 괄사 루틴",
        INBODYLIKE_SECTIONS,
        [
            ("Team/Product", "괄사 루틴 / Gwalsa Routine"),
            ("Representative", "권준 / Kwon Jun"),
            ("Contact", "kwonj0815@naver.com / 010-2445-0551"),
            ("Category", "Lifestyle self-care routine PWA"),
            ("File purpose", "Program application PDF draft"),
        ],
    )
    build_pdf(
        generic_path,
        "Gwalsa Routine Safe Compact Brief",
        GENERIC_SECTIONS,
        [
            ("Product", "Gwalsa Routine"),
            ("Representative", "Kwon Jun"),
            ("Contact", "kwonj0815@naver.com / 010-2445-0551"),
            ("Build", "20260612a05"),
            ("QA", "passed"),
        ],
    )
    print(inbody_path)
    print(generic_path)


if __name__ == "__main__":
    main()

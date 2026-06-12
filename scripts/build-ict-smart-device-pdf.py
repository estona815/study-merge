#!/usr/bin/env python3
"""Build a PDF application packet for the official ICT Smart Device upload."""

from __future__ import annotations

from html import escape
import textwrap
from pathlib import Path

from docx import Document
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output/submission/ict-smart-device/final-upload"
OUT_PDF = OUT_DIR / "권준.pdf"
TEMPLATE = ROOT / "output/submission/ict-smart-device/official-forms/application-general.docx"
FONT_PATH = Path("/System/Library/Fonts/Supplemental/AppleGothic.ttf")


APPLICANT = {
    "team": "괄사 루틴 팀",
    "name": "권준",
    "phone": "010-2445-0551",
    "email": "kwonj0815@naver.com",
    "item": "괄사 루틴",
    "date": "2026년 6월 10일",
}


def register_fonts() -> tuple[str, str]:
    if FONT_PATH.exists():
        pdfmetrics.registerFont(TTFont("AppleGothicLocal", str(FONT_PATH)))
        return "AppleGothicLocal", "AppleGothicLocal"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


styles = getSampleStyleSheet()
BODY = ParagraphStyle(
    "BodyKo",
    parent=styles["BodyText"],
    fontName=FONT,
    fontSize=9.3,
    leading=13.2,
    alignment=TA_LEFT,
    spaceAfter=4,
    wordWrap="CJK",
)
SMALL = ParagraphStyle("SmallKo", parent=BODY, fontSize=8.3, leading=11.4, textColor=colors.HexColor("#333333"))
TITLE = ParagraphStyle(
    "TitleKo",
    parent=BODY,
    fontName=FONT_BOLD,
    fontSize=17,
    leading=22,
    alignment=TA_CENTER,
    spaceAfter=10,
)
H1 = ParagraphStyle("H1Ko", parent=BODY, fontName=FONT_BOLD, fontSize=12.5, leading=16, spaceBefore=8, spaceAfter=6)
H2 = ParagraphStyle("H2Ko", parent=BODY, fontName=FONT_BOLD, fontSize=10.5, leading=14, spaceBefore=6, spaceAfter=4)
CENTER = ParagraphStyle("CenterKo", parent=BODY, alignment=TA_CENTER)


class Checkbox(Flowable):
    def __init__(self, checked: bool = False, size: float = 9):
        super().__init__()
        self.checked = checked
        self.size = size
        self.width = size
        self.height = size

    def draw(self):
        self.canv.setLineWidth(0.8)
        self.canv.rect(0, 0, self.size, self.size)
        if self.checked:
            self.canv.setLineWidth(1.2)
            self.canv.line(1.8, self.size * 0.45, self.size * 0.4, 1.8)
            self.canv.line(self.size * 0.4, 1.8, self.size - 1.8, self.size - 1.8)


def p(text: str, style=BODY) -> Paragraph:
    return Paragraph(text.replace("\n", "<br/>"), style)


def p_plain(text: str, style=BODY) -> Paragraph:
    return Paragraph(escape(text).replace("\n", "<br/>"), style)


def section(title: str, body: str):
    return [p(title, H1), p(body)]


def kv_table(rows, widths=(32 * mm, 118 * mm)):
    table = Table([[p(str(k), SMALL), p(str(v), BODY)] for k, v in rows], colWidths=list(widths), hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#777777")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F4F3")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def checkbox_row(label: str, checked: bool):
    box = "☑" if checked else "□"
    return p(f"{box} {label}")


def body_text() -> dict[str, str]:
    return {
        "need": (
            "일상 뷰티 셀프케어 루틴은 사용자가 순서, 시간, 기록 방식을 스스로 관리해야 해서 꾸준히 따라가기 어렵다. "
            "특히 모바일 환경에서는 루틴 안내, 타이머, 기록, 백업, 참고 동선 확인이 서로 흩어지기 쉽다. "
            "괄사 루틴은 이 흐름을 하나의 브라우저 기반 PWA 안에서 간단히 실행하고 기록할 수 있게 만드는 일반 뷰티 셀프케어 서비스다.\n\n"
            "본 아이디어는 서버 계정 없이 현재 브라우저 중심으로 동작하는 구조를 지향한다. 사용자는 루틴을 선택하고, 단계별 타이머를 따라가며, "
            "완료 후 기록과 사진 메모를 남길 수 있다. 얼굴 참고 가이드는 사용자가 직접 선택한 카메라 또는 업로드 이미지 위에 참고 동선을 표시하는 보조 기능으로 제한한다."
        ),
        "overview": (
            "괄사 루틴은 HTML, CSS, vanilla JavaScript로 구현된 정적 Web/PWA이다. 앱은 루틴 안내, 단계별 타이머, 로컬 기록, 사진 메모, "
            "백업/복원, 리마인더, 선택형 얼굴 참고 가이드를 제공한다. 데이터는 현재 브라우저의 localStorage를 중심으로 저장되며, 백업 파일은 사용자가 직접 생성할 때만 만들어진다.\n\n"
            "온디바이스 적용 관점에서, 얼굴 참고 가이드는 MediaPipe Face Landmarker 기반으로 브라우저 안에서 실행되는 참고 동선 표시 흐름이다. "
            "현재 build 20260612a06의 production QA는 real MediaPipe upload flow에서 provider=mediapipe, detectorSource=real, "
            "source=upload-landmark, referenceOnly=false, containsMock=false 조건으로 통과했다. QA-only mock/reference 경로는 운영 성공 기준으로 사용하지 않는다.\n\n"
            "클라우드 서버 없이 브라우저 로컬 중심으로 처리하면 사용자가 선택한 입력과 기록의 범위를 더 명확히 제어할 수 있고, 데모 환경에서는 QR 또는 URL로 빠르게 실행할 수 있다. "
            "현재 Face Landmarker 모델 파일은 앱 자산에 포함되어 있으며, MediaPipe Tasks Vision JS/WASM runtime은 CDN에서 필요 시 로드한다. 완전 오프라인 시연을 위해서는 runtime vendoring 후 재검증한다."
        ),
        "difference": (
            "괄사 루틴의 차별점은 뷰티 셀프케어 루틴, 타이머, 기록, 백업/삭제, 참고 동선 표시를 하나의 정적 PWA 흐름으로 묶은 데 있다. "
            "일반적인 루틴 메모나 타이머 앱은 얼굴 참고 동선과 로컬 기록 관리를 함께 제공하지 않는 경우가 많고, 영상 기반 콘텐츠는 사용자의 기록/백업/삭제 흐름과 분리되어 있다.\n\n"
            "본 서비스는 서버 계정, 분석 SDK, 광고 SDK, 결제 SDK 없이 현재 브라우저를 중심으로 동작한다. 얼굴 참고 가이드는 사용자 선택형이며, 사람 식별이나 지속적인 얼굴 템플릿 생성을 전제로 하지 않는다. "
            "제출 자료에서는 일반 뷰티 셀프케어 PWA 범위를 유지하고, 의료 목적이나 확정적 결과 표현을 사용하지 않는다."
        ),
        "market": (
            "초기 목표 사용자는 모바일 브라우저로 짧은 뷰티 셀프케어 루틴을 따라가고 기록하려는 일반 사용자다. "
            "초기 검증은 정적 Web/PWA 데모와 QR 기반 접근으로 진행하고, 사용성 피드백을 바탕으로 루틴 콘텐츠, 오프라인 시연, 미니앱 또는 네이티브 래퍼 가능성을 검토한다.\n\n"
            "사업화 모델은 초기에는 무료 Web/PWA 데모와 파트너십 검토 중심으로 설정한다. 향후 유료 콘텐츠, 구독, B2B 라이선스, 디바이스 연계 등은 개인정보, 결제, 약관, QA 범위를 새로 문서화한 뒤 검토한다. "
            "현재 제출 단계에서는 사용자 수, 매출, 수상, 인증, 제휴를 확정적으로 주장하지 않는다."
        ),
        "plan": (
            "현재 build 20260612a06 기준 Web/PWA release package와 store asset package가 생성되어 있다. "
            "Web release zip은 output/release/gwalsa-web-pwa-20260610-100147.zip이며 SHA-256은 4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0이다. "
            "최신 real-model QA evidence는 output/playwright/20260610-real-model-check/metrics.json이고 status는 passed이다.\n\n"
            "향후 계획은 1단계로 안정적인 HTTPS 데모 URL 배포와 QR 테스트를 진행하고, 2단계로 목표 디바이스/브라우저에서 카메라 권한, 업로드 fallback, 서비스 워커 동작, 로컬 삭제/초기화 흐름을 확인한다. "
            "3단계에서는 완전 오프라인 시연이 필요할 경우 MediaPipe Tasks Vision runtime을 앱 자산에 포함하고 QA를 다시 수행한다. 4단계에서는 제출/심사 피드백에 따라 루틴 콘텐츠, 접근성, 저사양 기기 성능을 개선한다."
        ),
    }


def official_legal_texts() -> dict[str, str]:
    source = Document(str(TEMPLATE))
    terms = source.tables[8].rows[0].cells[0].text
    consent = source.tables[9].rows[3].cells[0].text
    privacy_intro = source.tables[10].rows[0].cells[0].text
    privacy_collect = source.tables[11].rows[1].cells[0].text
    privacy_third = source.tables[11].rows[3].cells[0].text
    privacy_note = source.tables[11].rows[5].cells[0].text
    return {
        "terms": terms,
        "consent": consent,
        "privacy_intro": privacy_intro,
        "privacy_collect": privacy_collect,
        "privacy_third": privacy_third,
        "privacy_note": privacy_note,
    }


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont(FONT, 8)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, f"{doc.page}")
    canvas.restoreState()


def build() -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT_PDF),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=17 * mm,
        bottomMargin=17 * mm,
        title="2026 ICT 스마트 디바이스 전국 공모전 일반부문 지원신청서 - 괄사 루틴",
        author=APPLICANT["name"],
    )

    story = []
    story.append(p("2026년 ICT 스마트 디바이스 전국 공모전 일반부문 지원신청서", TITLE))
    story.append(kv_table([
        ("접수분야", "일반부문"),
        ("아이디어명", APPLICANT["item"]),
        ("팀명", APPLICANT["team"]),
        ("참가자 대표", APPLICANT["name"]),
        ("휴대전화", APPLICANT["phone"]),
        ("E-mail", APPLICANT["email"]),
        ("제출일", APPLICANT["date"]),
    ]))
    story.append(Spacer(1, 6))
    story.append(p("신청인은 위 아이디어로 「2026년 ICT 스마트 디바이스 전국 공모전」에 성실히 참여하고자 본 신청서를 제출합니다.", BODY))
    story.append(Spacer(1, 10))
    story.append(p(f"참가자 대표: {APPLICANT['name']} (인)", CENTER))

    story.append(PageBreak())
    story.append(p("붙임 1. ICT 스마트 디바이스 전국 공모전 출품 아이디어 상세내용", TITLE))
    story.append(kv_table([
        ("아이디어명", APPLICANT["item"]),
        ("디바이스 구현 방식", "기존 상용 디바이스에 SW만 탑재하여 아이디어 구현 (APP, 솔루션 등)"),
        ("현재개발단계", "MVP개발 중 (정적 Web/PWA build 20260612a06, real MediaPipe QA 통과)"),
    ]))
    for title, body in [
        ("1. 아이디어의 필요성", body_text()["need"]),
        ("2. 아이디어 개요 및 작동 원리", body_text()["overview"]),
        ("3. 혁신성 및 차별성", body_text()["difference"]),
        ("4. 목표시장 및 사업화 모델", body_text()["market"]),
        ("5. 개발 진행 현황 및 계획", body_text()["plan"]),
    ]:
        story.append(p(title, H1))
        story.append(p(body, BODY))

    story.append(p("유사 아이디어의 과거 수상 이력", H1))
    story.append(kv_table([
        ("대회명", "해당 없음"),
        ("상격", "해당 없음"),
        ("수상일자", "해당 없음"),
        ("수상 당시 팀명", APPLICANT["team"]),
        ("수상 아이디어명", APPLICANT["item"]),
        ("차이점", "유사 아이디어 수상 이력 없음"),
    ], widths=(42 * mm, 108 * mm)))

    story.append(p("참가팀 구성", H1))
    story.append(kv_table([
        ("참가자 대표", f"{APPLICANT['name']} / 기획, 개발, QA, 제출 총괄"),
        ("팀원", "해당 없음"),
    ], widths=(42 * mm, 108 * mm)))

    story.append(PageBreak())
    legal = official_legal_texts()
    story.append(p("붙임 2. 2026년 ICT 스마트 디바이스 전국 공모전 참가 약관", TITLE))
    story.append(p_plain(legal["terms"], SMALL))
    story.append(Spacer(1, 12))
    story.append(p(f"{APPLICANT['date']}\n제안자 대표(갑): {APPLICANT['name']} (인)", CENTER))

    story.append(PageBreak())
    story.append(p("붙임 3. 2026년 ICT 스마트 디바이스 전국 공모전 참가 동의서", TITLE))
    story.append(kv_table([
        ("아이디어명", APPLICANT["item"]),
        ("성명", APPLICANT["name"]),
        ("팀명", APPLICANT["team"]),
    ]))
    story.append(p_plain(legal["consent"], SMALL))
    story.append(Spacer(1, 12))
    story.append(p(f"{APPLICANT['date']}\n참가자 대표: {APPLICANT['name']} (인)", CENTER))

    story.append(PageBreak())
    story.append(p("붙임 4. 참가자 개인정보 수집ㆍ이용ㆍ제공 동의서", TITLE))
    story.append(p_plain(legal["privacy_intro"], SMALL))
    story.append(p_plain(legal["privacy_collect"], SMALL))
    story.append(Spacer(1, 6))
    story.append(checkbox_row("개인정보 수집ㆍ이용에 동의합니다.", True))
    story.append(Spacer(1, 6))
    story.append(p_plain(legal["privacy_third"], SMALL))
    story.append(checkbox_row("개인정보 제3자 제공에 동의합니다.", True))
    story.append(p_plain(legal["privacy_note"], SMALL))
    story.append(Spacer(1, 12))
    story.append(p(f"{APPLICANT['date']}\n신청자: {APPLICANT['name']} (서명/인)", CENTER))

    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    return OUT_PDF


if __name__ == "__main__":
    print(build())

#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_ROOT = ROOT / "output" / "apps-in-toss"
APP_BUILD_RE = 'const appBuild = "'
SW_CACHE_RE = 'const cacheName = "'
BRAND = "#2F7D72"
INK = "#173F3B"
PAPER = "#FFF8ED"
BRAND_SOURCE = ROOT / "assets" / "brand" / "ssagwal-source.jpg"


def read_between(file: Path, marker: str) -> str:
    text = file.read_text(encoding="utf-8")
    start = text.index(marker) + len(marker)
    end = text.index('"', start)
    return text[start:end]


def sha256(file: Path) -> str:
    h = hashlib.sha256()
    with file.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def png_size(file: Path) -> tuple[int, int]:
    with Image.open(file) as image:
        return image.size


def copy_required(src: Path, dest: Path) -> None:
    if not src.exists():
        raise FileNotFoundError(f"missing input: {src.relative_to(ROOT)}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/AppleSDGothicNeo.ttc",
        "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            try:
                return ImageFont.truetype(candidate, size=size, index=2 if bold else 0)
            except Exception:
                try:
                    return ImageFont.truetype(candidate, size=size)
                except Exception:
                    pass
    return ImageFont.load_default()


def cover_resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    new_size = (round(image.width * scale), round(image.height * scale))
    resized = image.resize(new_size, Image.Resampling.LANCZOS)
    left = max(0, (resized.width - target_w) // 2)
    top = max(0, (resized.height - target_h) // 2)
    return resized.crop((left, top, left + target_w, top + target_h))


def contain_resize(image: Image.Image, size: tuple[int, int], fill: str = PAPER) -> Image.Image:
    target_w, target_h = size
    scale = min(target_w / image.width, target_h / image.height)
    new_size = (round(image.width * scale), round(image.height * scale))
    resized = image.resize(new_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, fill)
    canvas.paste(resized.convert("RGB"), ((target_w - resized.width) // 2, (target_h - resized.height) // 2))
    return canvas


def load_brand_image() -> Image.Image:
    image = Image.open(BRAND_SOURCE).convert("RGB")
    pixels = image.load()
    width, height = image.size
    visited = set()
    stack = []
    for x in range(width):
        stack.append((x, 0))
        stack.append((x, height - 1))
    for y in range(height):
        stack.append((0, y))
        stack.append((width - 1, y))
    while stack:
        x, y = stack.pop()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue
        r, g, b = pixels[x, y]
        if max(r, g, b) > 110:
            continue
        visited.add((x, y))
        stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    cleaned = image.copy()
    cleaned_pixels = cleaned.load()
    fill = (246, 86, 141)
    for x, y in visited:
        cleaned_pixels[x, y] = fill
    return cleaned


def make_logo(dest: Path) -> None:
    result = cover_resize(load_brand_image(), (600, 600))
    dest.parent.mkdir(parents=True, exist_ok=True)
    result.save(dest, "PNG", optimize=True)


def make_thumbnail(dest: Path) -> None:
    source = ROOT / "output" / "playwright" / "20260608-launch-demo" / "desktop" / "screen-routines-1280.png"
    shot = Image.open(source).convert("RGB")
    bg = Image.new("RGB", (1932, 828), "#f75b95")
    ui = cover_resize(shot, (1152, 828))
    bg.paste(ui, (780, 0))
    layer = Image.new("RGBA", bg.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)
    draw.rectangle((720, 0, 910, 828), fill=(247, 91, 149, 132))
    draw.rectangle((0, 0, 820, 828), fill=(247, 91, 149, 255))
    draw.rectangle((666, 0, 820, 828), fill=(255, 255, 255, 42))
    brand = load_brand_image().resize((620, 620), Image.Resampling.LANCZOS)
    layer.paste(brand.convert("RGBA"), (82, 60))
    draw.text((96, 686), "괄사 루틴 · 타이머 · 로컬 기록", font=font(34, bold=True), fill=(255, 255, 255, 255))
    result = Image.alpha_composite(bg.convert("RGBA"), layer).convert("RGB")
    dest.parent.mkdir(parents=True, exist_ok=True)
    result.save(dest, "PNG", optimize=True)


def make_vertical_shot(src: Path, dest: Path) -> None:
    image = Image.open(src).convert("RGB")
    result = cover_resize(image, (636, 1048))
    dest.parent.mkdir(parents=True, exist_ok=True)
    result.save(dest, "PNG", optimize=True)


def make_horizontal_shot(src: Path, dest: Path) -> None:
    image = Image.open(src).convert("RGB")
    result = cover_resize(image, (1504, 741))
    dest.parent.mkdir(parents=True, exist_ok=True)
    result.save(dest, "PNG", optimize=True)


def write_text(file: Path, content: str) -> None:
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content.strip() + "\n", encoding="utf-8")


def zip_dir(package_dir: Path, zip_path: Path) -> None:
    if zip_path.exists():
        zip_path.unlink()
    subprocess.run(
        ["zip", "-qr", str(zip_path), package_dir.name],
        cwd=package_dir.parent,
        check=True,
    )
    (zip_path.with_suffix(zip_path.suffix + ".sha256")).write_text(
        f"{sha256(zip_path)}  {zip_path.name}\n",
        encoding="utf-8",
    )


def main() -> int:
    stamp = sys.argv[1] if len(sys.argv) > 1 else datetime.now(ZoneInfo("Asia/Seoul")).strftime("%Y%m%d-%H%M%S")
    package_name = f"gwalsa-apps-in-toss-submission-{stamp}"
    package_dir = OUT_ROOT / package_name
    zip_path = OUT_ROOT / f"{package_name}.zip"
    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir(parents=True)

    app_build = read_between(ROOT / "app.js", APP_BUILD_RE)
    sw_cache = read_between(ROOT / "service-worker.js", SW_CACHE_RE)
    latest_release = json.loads((ROOT / "output" / "release" / "latest-web-release.json").read_text(encoding="utf-8"))
    latest_store = json.loads((ROOT / "output" / "store-assets" / "latest-store-assets.json").read_text(encoding="utf-8"))
    blocker_report = json.loads((ROOT / "docs" / "launch-blockers.json").read_text(encoding="utf-8"))

    assets_dir = package_dir / "console-assets"
    screenshots_dir = assets_dir / "screenshots"
    docs_dir = package_dir / "docs"
    evidence_dir = package_dir / "evidence"

    logo = assets_dir / "logo-600x600.png"
    thumbnail = assets_dir / "thumbnail-1932x828.png"
    make_logo(logo)
    make_thumbnail(thumbnail)

    vertical_sources = [
        ("01-today-636x1048.png", ROOT / "output" / "playwright" / "20260608-launch-demo" / "screen-today-430.png"),
        ("02-routines-636x1048.png", ROOT / "output" / "playwright" / "20260608-launch-demo" / "screen-routines-430.png"),
        ("03-completion-636x1048.png", ROOT / "output" / "playwright" / "20260608-launch-demo" / "completion-430.png"),
        ("04-records-636x1048.png", ROOT / "output" / "playwright" / "20260608-launch-demo" / "screen-log-430.png"),
        ("05-face-guide-636x1048.png", ROOT / "output" / "playwright" / "20260608-launch-demo" / "screen-face-guide-390.png"),
    ]
    generated_assets = [
        {"kind": "logo", "path": logo, "requiredSize": [600, 600], "source": "assets/icon-512.png"},
        {"kind": "thumbnail", "path": thumbnail, "requiredSize": [1932, 828], "source": "output/playwright/20260608-launch-demo/desktop/screen-routines-1280.png"},
    ]
    for filename, source in vertical_sources:
        dest = screenshots_dir / "vertical" / filename
        make_vertical_shot(source, dest)
        generated_assets.append({"kind": "verticalScreenshot", "path": dest, "requiredSize": [636, 1048], "source": str(source.relative_to(ROOT))})

    horizontal = screenshots_dir / "horizontal" / "01-routines-1504x741.png"
    make_horizontal_shot(ROOT / "output" / "playwright" / "20260608-launch-demo" / "desktop" / "screen-routines-1280.png", horizontal)
    generated_assets.append({"kind": "horizontalScreenshot", "path": horizontal, "requiredSize": [1504, 741], "source": "output/playwright/20260608-launch-demo/desktop/screen-routines-1280.png"})

    copy_required(ROOT / "output" / "release" / "latest-web-release.json", evidence_dir / "latest-web-release.json")
    copy_required(ROOT / "output" / "store-assets" / "latest-store-assets.json", evidence_dir / "latest-store-assets.json")
    copy_required(ROOT / "docs" / "launch-blockers.json", evidence_dir / "launch-blockers.json")
    copy_required(ROOT / "output" / "playwright" / "20260608-launch-demo" / "metrics.json", evidence_dir / "launch-screenshot-metrics.json")
    copy_required(ROOT / "output" / "playwright" / "20260608-functional-smoke" / "functional-smoke-report.json", evidence_dir / "functional-smoke-report.json")
    copy_required(ROOT / "output" / "playwright" / "20260610-real-model-check" / "metrics.json", evidence_dir / "real-face-model-metrics.json")

    console_copy = f"""
    # Apps in Toss Console Entry Draft

    작성 기준: 2026-06-12 KST

    ## 기본 등록

    | 콘솔 항목 | 입력 초안 |
    | --- | --- |
    | 앱 이름 | 싸괄 |
    | 영문명 | Sagwal |
    | appName | sagwal |
    | 앱 유형 | 비게임 |
    | 브랜드 색상 | #2F7D72 |
    | 사용 연령 | 콘솔 정책에 따름 |
    | 카테고리 | 비게임 > 뷰티/라이프스타일/건강관리 중 콘솔 옵션에 맞게 선택 |

    `appName`은 등록 후 수정이 제한될 수 있으니 콘솔에서 확정하기 전 한 번 더 확인하세요.

    ## 부제

    3분 괄사 셀프케어 타이머

    ## 상세 설명

    싸괄은 토스 안에서 바로 열어 사용할 수 있는 괄사 셀프케어 미니앱입니다. 사용자는 짧은 루틴을 선택하고 단계별 타이머를 따라가며, 완료 후 현재 기기 안에 기록을 남길 수 있습니다.

    선택형 참고 동선 기능은 사용자가 직접 카메라 또는 사진을 선택했을 때만 동선을 표시합니다. 얼굴 사진과 기록은 서버로 전송하지 않고 브라우저/미니앱 로컬 저장소 중심으로 처리합니다.

    이 앱은 일반 뷰티 셀프케어 참고용이며 치료, 진단, 의료 목적 또는 특정 외모 변화 보장을 제공하지 않습니다.

    ## 고객센터/정책 URL

    - 개인정보처리방침 URL: owner 입력 필요
    - 이용약관 URL: owner 입력 필요
    - 고객센터 이메일 또는 URL: owner 입력 필요

    ## 권한 설명

    - 카메라: 사용자가 참고 동선 표시를 직접 시작할 때만 사용합니다.
    - 사진: 사용자가 참고 이미지 또는 기록 이미지를 직접 선택할 때만 사용합니다.
    - 권한을 거부해도 기본 루틴, 수동 기록, 백업 기능은 계속 사용할 수 있습니다.

    ## 업로드 에셋

    - 앱 로고: `console-assets/logo-600x600.png`
    - 썸네일: `console-assets/thumbnail-1932x828.png`
    - 세로 스크린샷: `console-assets/screenshots/vertical/`
    - 가로 스크린샷: `console-assets/screenshots/horizontal/`

    ## 현재 빌드 증거

    - App build: `{app_build}`
    - Service worker cache: `{sw_cache}`
    - Web release zip: `{latest_release.get("zipPath")}`
    - Web release SHA-256: `{latest_release.get("zipSha256")}`
    - Store assets zip: `{latest_store.get("zipPath")}`
    - Store assets SHA-256: `{latest_store.get("zipSha256")}`
    """
    write_text(docs_dir / "console-entry-draft.md", console_copy)

    sandbox_checklist = """
    # Apps in Toss Sandbox QA Checklist

    ## 설치/업로드

    - [ ] npm 또는 pnpm이 있는 환경에서 의존성 설치
    - [ ] 공식 문서 기준 `ait init` 또는 동등한 프로젝트 초기화 확인
    - [ ] `granite.config.ts`의 `appName`, `brand.icon`, 권한 설정 확인
    - [ ] `npm run build:web`로 `dist/` 생성 확인
    - [ ] 최종 `.ait` 번들 생성
    - [ ] 콘솔에 `.ait` 업로드

    ## Toss 앱 Sandbox 실기기

    - [ ] 미니앱 첫 진입이 2초 이상 멈추지 않음
    - [ ] 공통 내비게이션 바와 앱 자체 뒤로가기/홈 흐름이 충돌하지 않음
    - [ ] 루틴 시작, 일시정지, 다음 단계, 완료 기록 저장 확인
    - [ ] 카메라 권한 거부 후 기본 루틴과 업로드/수동 기록이 계속 동작
    - [ ] 사진 업로드 실패 이미지에서 오류 없이 안내 표시
    - [ ] 실제 얼굴 이미지 업로드 시 MediaPipe 기반 참고 동선 표시
    - [ ] `?referenceGuide=1` 없이 mock/reference 성공이 나오지 않음
    - [ ] 개인정보처리방침/이용약관/지원 URL이 콘솔/앱 내에서 열림
    - [ ] localStorage 삭제/초기화 흐름 확인
    - [ ] 콘솔 오류 또는 화면 멈춤 없음
    """
    write_text(docs_dir / "sandbox-qa-checklist.md", sandbox_checklist)

    readme = f"""
    # Sagwal Apps in Toss Submission Package

    - Package: `{package_name}`
    - Generated KST: `{datetime.now(ZoneInfo("Asia/Seoul")).isoformat(timespec="seconds")}`
    - App build: `{app_build}`
    - Service worker cache: `{sw_cache}`

    ## Contents

    - `console-assets/`: Apps in Toss console image assets in exact required dimensions
    - `docs/console-entry-draft.md`: copy/paste console draft
    - `docs/sandbox-qa-checklist.md`: final sandbox checklist
    - `evidence/`: launch gate, smoke, real MediaPipe, and latest release pointers
    - `submission-manifest.json`: checksums and dimensions

    ## Still Owner-Provided

    Public privacy/terms/support URLs, developer/contact info, final console category, final icon URL in `granite.config.ts`, official `.ait` bundle creation/upload, and Toss app sandbox pass.
    """
    write_text(package_dir / "README.md", readme)

    now_utc = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    now_kst = datetime.now(ZoneInfo("Asia/Seoul")).replace(microsecond=0).isoformat()
    manifest_assets = []
    for item in generated_assets:
        path = item["path"]
        width, height = png_size(path)
        required = tuple(item["requiredSize"])
        status = "passed" if (width, height) == required else "failed"
        manifest_assets.append({
            "kind": item["kind"],
            "path": str(path.relative_to(package_dir)),
            "source": item["source"],
            "width": width,
            "height": height,
            "requiredWidth": required[0],
            "requiredHeight": required[1],
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
            "status": status,
        })

    manifest = {
        "packageName": package_name,
        "generatedAtUtc": now_utc,
        "generatedAtKst": now_kst,
        "appBuild": app_build,
        "serviceWorkerCache": sw_cache,
        "status": "ready-for-console-input",
        "repoLaunchStatus": blocker_report.get("webPwaLaunch", {}).get("status", "unknown"),
        "storeSubmissionStatus": blocker_report.get("storeSubmission", {}).get("status", "unknown"),
        "assets": manifest_assets,
        "latestRelease": latest_release,
        "latestStoreAssets": latest_store,
        "officialReferences": [
            "https://developers-apps-in-toss.toss.im/prepare/console-workspace.html",
            "https://developers-apps-in-toss.toss.im/checklist/app-nongame.html",
            "https://developers-apps-in-toss.toss.im/tutorials/webview.html",
            "https://developers-apps-in-toss.toss.im/intro/guide.html",
        ],
        "ownerInputsStillRequired": [
            "public privacy URL",
            "public terms URL",
            "public support URL or email",
            "developer/contact identity",
            "final console category",
            "final appName confirmation",
            "final brand icon URL in granite.config.ts",
            "official .ait build/upload",
            "Toss app sandbox pass",
        ],
    }
    (package_dir / "submission-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    zip_dir(package_dir, zip_path)
    latest_pointer = {
        "packageName": package_name,
        "generatedAtUtc": now_utc,
        "generatedAtKst": now_kst,
        "appBuild": app_build,
        "serviceWorkerCache": sw_cache,
        "packageDir": str(package_dir.relative_to(ROOT)),
        "zipPath": str(zip_path.relative_to(ROOT)),
        "sha256Path": str(zip_path.with_suffix(zip_path.suffix + ".sha256").relative_to(ROOT)),
        "zipSha256": sha256(zip_path),
        "manifestPath": str((package_dir / "submission-manifest.json").relative_to(ROOT)),
        "status": "ready-for-console-input",
    }
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    (OUT_ROOT / "latest-apps-in-toss-submission.json").write_text(json.dumps(latest_pointer, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(latest_pointer, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

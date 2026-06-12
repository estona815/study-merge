const fs = require("fs/promises");
const path = require("path");
const { existsSync } = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("[ERROR] playwright package not found. Install with: npm i -D playwright");
  console.error("[ERROR] 또는 NODE_MODULE_DIR/캐시 환경에서 Playwright 경로를 확인하세요.");
  process.exit(1);
}

const baseUrl = process.env.LAUNCH_BASE_URL || "http://127.0.0.1:4173/index.html";
const outDir = path.resolve(process.env.LAUNCH_SCREENSHOT_OUT || "output/playwright/20260608-launch-demo");
const chromeCandidates = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

function getChromeExecutable() {
  return chromeCandidates.find((candidate) => existsSync(candidate)) || null;
}

function appUrl(params = {}) {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function screenUrl(name) {
  return appUrl({ launchDemo: `screen:${name}` });
}

function publicUrl(file) {
  return new URL(`./public/${file}`, baseUrl).toString();
}

const publicPageCases = [
  {
    sourceFile: "privacy-policy.html",
    onlineOutput: "public-privacy-390.png",
    offlineOutput: "public-privacy-offline-390.png",
    heading: "개인정보 처리방침",
  },
  {
    sourceFile: "terms-disclaimer.html",
    onlineOutput: "public-terms-390.png",
    offlineOutput: "public-terms-offline-390.png",
    heading: "이용약관",
  },
  {
    sourceFile: "support.html",
    onlineOutput: "public-support-390.png",
    offlineOutput: "public-support-offline-390.png",
    heading: "지원 안내",
  },
];

async function writeReadme(report) {
  const lines = [
    "# Launch Screenshot Evidence",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${baseUrl}`,
    "",
    "## Files",
    ...report.files.map((file) => `- ${file}`),
    "",
    "## Verification",
    `- Page errors: ${report.errors.length}`,
    `- Console errors: ${report.consoleErrors.length}`,
    `- Offline reload: ${report.offlineReload}`,
    `- Offline public pages: ${JSON.stringify(report.offlinePublicPages)}`,
    `- Service worker ready: ${report.swReady ? "yes" : "no"}`,
    `- Gate status: ${report.gateStatus || "unknown"}`,
    "",
    "See `metrics.json` for viewport, overflow, and copy-sweep evidence.",
  ];
  await fs.writeFile(path.join(outDir, "README.md"), `${lines.join("\n")}\n`);
}

function attachDiagnostics(page, report) {
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(message.text());
  });
}

async function collectMetrics(page, label) {
  return page.evaluate((metricLabel) => {
    const riskyTerms = [
      "신뢰도",
      "자동 추천",
      "가이드 분석",
      "분석하기",
      "분석 완료",
      "아침 붓기",
      "부기 리셋",
      "광대 리프트",
      "효과 유지",
      "전후 변화",
      "단계 단계",
    ];
    const doc = document.documentElement;
    const body = document.body;
    const text = body.innerText || "";
    const activeScreen = document.querySelector(".screen.active")?.id || null;
    return {
      label: metricLabel,
      activeScreen,
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      bodyScrollWidth: body.scrollWidth,
      overflowX: doc.scrollWidth > doc.clientWidth + 1 || body.scrollWidth > innerWidth + 1,
      riskyTerms: riskyTerms.filter((term) => text.includes(term)),
    };
  }, label);
}

async function screenshot(page, file, report, options = {}) {
  const fullPath = path.join(outDir, file);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await page.screenshot({ path: fullPath, fullPage: Boolean(options.fullPage) });
  report.files.push(file);
  report.metrics.push(await collectMetrics(page, file));
}

async function openDemoPage(context, url, report) {
  const page = await context.newPage();
  attachDiagnostics(page, report);
  await page.goto(url, { waitUntil: "networkidle" });
  return page;
}

async function captureStaticScreens(browser, viewport, suffix, report) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: suffix === "1280" ? 1 : 2,
    isMobile: suffix !== "1280",
    hasTouch: suffix !== "1280",
  });
  const screens = suffix === "1280"
    ? ["today", "routines", "log", "settings", "face-routine"]
    : ["onboarding", "today", "routines", "log", "settings"];
  for (const screen of screens) {
    const page = await openDemoPage(context, screenUrl(screen), report);
    await screenshot(page, `${suffix === "1280" ? "desktop/" : ""}screen-${screen}-${suffix}.png`, report);
    await page.close();
  }
  await context.close();
}

async function captureCompletion(browser, viewport, suffix, report) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await openDemoPage(context, appUrl({ launchDemo: "completion" }), report);
  await screenshot(page, `completion-${suffix}.png`, report);
  await page.close();
  await context.close();
}

async function captureFaceFlow(browser, report) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await openDemoPage(context, appUrl({ referenceGuide: "1" }), report);
  const close = page.locator("#closeOnboardingButton");
  if (await close.isVisible().catch(() => false)) await close.click();
  await page.click("#startFaceScanFromHomeButton");
  await page.waitForTimeout(150);
  await screenshot(page, "screen-face-scan-390.png", report);
  await page.setInputFiles("#faceUploadInput", path.resolve("assets/icon-512.png"));
  await page.waitForSelector("#screen-face-routine.active", { timeout: 5000 });
  await page.waitForTimeout(200);
  await screenshot(page, "screen-face-routine-390.png", report);
  await page.click("#startFaceGuideButton");
  await page.waitForSelector("#screen-face-guide.active", { timeout: 5000 });
  await page.waitForTimeout(200);
  await screenshot(page, "screen-face-guide-390.png", report);
  await page.click("#faceGuideCompleteButton");
  await page.waitForSelector("#screen-face-complete.active", { timeout: 5000 });
  await page.waitForTimeout(200);
  await screenshot(page, "screen-face-complete-390.png", report);
  report.swReady = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return false;
    try {
      await navigator.serviceWorker.ready;
      return true;
    } catch {
      return false;
    }
  });
  await context.setOffline(true);
  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 5000 });
    await page.waitForTimeout(250);
    await screenshot(page, "screen-offline-reload-390.png", report);
    report.offlineReload = "ok";
  } catch (error) {
    report.offlineReload = error.message;
  }
  report.offlinePublicPages = {};
  for (const item of publicPageCases) {
    try {
      await page.goto(publicUrl(item.sourceFile), { waitUntil: "domcontentloaded", timeout: 5000 });
      await page.waitForTimeout(250);
      const heading = await page.locator("h1").textContent({ timeout: 1000 });
      if (!heading || !heading.includes(item.heading)) {
        throw new Error(`unexpected offline ${item.sourceFile} heading: ${heading || "missing"}`);
      }
      await screenshot(page, item.offlineOutput, report, { fullPage: true });
      report.offlinePublicPages[item.sourceFile] = "ok";
    } catch (error) {
      report.offlinePublicPages[item.sourceFile] = error.message;
    }
  }
  report.offlinePublicSupport = report.offlinePublicPages["support.html"] || "not-run";
  await context.setOffline(false);
  await context.close();
}

async function capturePublicPages(browser, report) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  for (const item of publicPageCases) {
    const page = await openDemoPage(context, publicUrl(item.sourceFile), report);
    await screenshot(page, item.onlineOutput, report, { fullPage: true });
    await page.close();
  }
  await context.close();
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const executablePath = getChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  const report = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    files: [],
    errors: [],
    consoleErrors: [],
    metrics: [],
    swReady: false,
    offlineReload: "not-run",
    offlinePublicSupport: "not-run",
    offlinePublicPages: {},
  };
  await captureStaticScreens(browser, { width: 390, height: 844 }, "390", report);
  await captureStaticScreens(browser, { width: 430, height: 932 }, "430", report);
  await captureCompletion(browser, { width: 390, height: 844 }, "390", report);
  await captureCompletion(browser, { width: 430, height: 932 }, "430", report);
  await captureFaceFlow(browser, report);
  await capturePublicPages(browser, report);
  await captureStaticScreens(browser, { width: 1280, height: 900 }, "1280", report);
  await browser.close();
  const summary = {
    files: report.files.length,
    errors: report.errors.length,
    consoleErrors: report.consoleErrors.length,
    overflowRows: report.metrics.filter((item) => item.overflowX).length,
    riskyTermRows: report.metrics.filter((item) => item.riskyTerms.length).length,
    swReady: report.swReady,
    offlineReload: report.offlineReload,
    offlinePublicSupport: report.offlinePublicSupport,
    offlinePublicPages: report.offlinePublicPages,
  };
  const offlinePublicFailures = Object.entries(report.offlinePublicPages || {})
    .filter(([, value]) => value !== "ok");
  const gateFailures = [];
  if (summary.errors) gateFailures.push(`page errors=${summary.errors}`);
  if (summary.consoleErrors) gateFailures.push(`console errors=${summary.consoleErrors}`);
  if (summary.overflowRows) gateFailures.push(`overflow rows=${summary.overflowRows}`);
  if (summary.riskyTermRows) gateFailures.push(`risky term rows=${summary.riskyTermRows}`);
  if (!summary.swReady) gateFailures.push("service worker not ready");
  if (summary.offlineReload !== "ok") gateFailures.push(`offline reload=${summary.offlineReload}`);
  if (summary.offlinePublicSupport !== "ok") gateFailures.push(`offline support=${summary.offlinePublicSupport}`);
  if (offlinePublicFailures.length) {
    gateFailures.push(`offline public pages=${offlinePublicFailures.map(([file, value]) => `${file}:${value}`).join(",")}`);
  }
  report.gateStatus = gateFailures.length ? "failed" : "passed";
  report.gateFailures = gateFailures;
  await fs.writeFile(path.join(outDir, "metrics.json"), JSON.stringify(report, null, 2));
  await writeReadme(report);
  console.log(JSON.stringify({ ...summary, gateStatus: report.gateStatus, gateFailures }, null, 2));
  if (gateFailures.length) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

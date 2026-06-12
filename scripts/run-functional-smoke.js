const fs = require("fs/promises");
const path = require("path");
const { existsSync } = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("[ERROR] playwright package not found for functional smoke.");
  process.exit(1);
}

const baseUrl = process.env.FUNCTIONAL_SMOKE_BASE_URL || "http://127.0.0.1:4173/index.html";
const appUrl = getUrlWithParam(baseUrl, "referenceGuide", "1");
const outDir = path.resolve(process.env.FUNCTIONAL_SMOKE_OUT || "output/playwright/20260609-functional-smoke");
const storageKey = "gwalsa-routine-state-v1";
const chromeCandidates = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

function getChromeExecutable() {
  return chromeCandidates.find((candidate) => existsSync(candidate)) || null;
}

function getUrlWithParam(url, key, value) {
  const parsed = new URL(url);
  parsed.searchParams.set(key, value);
  return parsed.toString();
}

function getCanonicalBackupValue(value) {
  if (Array.isArray(value)) return value.map(getCanonicalBackupValue);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value)
    .filter((key) => key !== "backupCode" && key !== "backupCodeStatus")
    .sort()
    .reduce((next, key) => {
      next[key] = getCanonicalBackupValue(value[key]);
      return next;
    }, {});
}

function hashBackupText(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).toUpperCase().padStart(7, "0");
}

function getBackupCode(payload) {
  return `GWA-${hashBackupText(JSON.stringify(getCanonicalBackupValue(payload)))}`;
}

async function setDetailsOpen(page, selector) {
  await page.locator(selector).evaluate((element) => {
    element.open = true;
  });
}

async function getStoredState(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), storageKey);
}

async function assertStoredLogCount(page, expectedCount, label) {
  const state = await getStoredState(page);
  const count = Array.isArray(state?.logs) ? state.logs.length : 0;
  if (count !== expectedCount) {
    throw new Error(`${label}: expected ${expectedCount} logs, got ${count}`);
  }
  return state;
}

async function closeOnboardingIfVisible(page) {
  const closeButton = page.locator("#closeOnboardingButton");
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    await page.waitForTimeout(100);
  }
}

async function runManualLogFlow(page) {
  await page.click('.nav-item[data-screen="log"]');
  await page.waitForSelector("#screen-log.active", { timeout: 3000 });
  await setDetailsOpen(page, "details.log-entry-collapse:has(#saveManualLogButton)");
  await page.selectOption("#skinReaction", "warm");
  await page.fill("#sessionNote", "기능 smoke 수동 기록");
  await page.click("#saveManualLogButton");
  await page.waitForFunction((key) => {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(saved?.logs) && saved.logs.length === 1;
  }, storageKey);
  const state = await assertStoredLogCount(page, 1, "manual log");
  const log = state.logs[0];
  if (log.note !== "기능 smoke 수동 기록" || log.reaction !== "warm") {
    throw new Error("manual log content was not persisted correctly");
  }
  const logText = await page.locator("#logList").innerText();
  if (!logText.includes("기능 smoke 수동 기록")) {
    throw new Error("manual log did not render in the log list");
  }
  return { status: "passed", logId: log.id };
}

async function runBackupFlow(page) {
  await page.click('.nav-item[data-screen="settings"]');
  await page.waitForSelector("#screen-settings.active", { timeout: 3000 });
  await setDetailsOpen(page, "details.backup-collapse");
  await page.click("#exportLightDataButton");
  await page.waitForFunction(() => {
    const text = document.querySelector("#backupPayload")?.value || "";
    return text.includes('"backupMode": "light"') && text.includes('"backupCode"');
  });
  const originalText = await page.locator("#backupPayload").inputValue();
  const originalPayload = JSON.parse(originalText);
  if (originalPayload.backupMode !== "light" || originalPayload.logs.length !== 1) {
    throw new Error("light backup payload does not include the expected one log");
  }
  if (JSON.stringify(originalPayload).includes("data:image")) {
    throw new Error("light backup unexpectedly contains image data");
  }

  const mergePayload = JSON.parse(JSON.stringify(originalPayload));
  mergePayload.logs.unshift({
    ...mergePayload.logs[0],
    id: "functional-smoke-merged-log",
    date: new Date(Date.now() + 1000).toISOString(),
    note: "기능 smoke 병합 기록",
  });
  delete mergePayload.backupCodeStatus;
  mergePayload.backupCode = getBackupCode(mergePayload);

  await page.fill("#backupPayload", JSON.stringify(mergePayload, null, 2));
  await page.click("#previewBackupButton");
  await page.waitForFunction(() => {
    const text = document.querySelector("#backupSummaryValue")?.textContent || "";
    return text.includes("미리보기") && text.includes("병합 새 기록 1건");
  });
  await page.click("#mergeBackupButton");
  await page.waitForFunction((key) => {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(saved?.logs) && saved.logs.length === 2;
  }, storageKey);
  await assertStoredLogCount(page, 2, "backup merge");
  await page.click("#restoreBackupChangeButton");
  await page.waitForFunction((key) => {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(saved?.logs) && saved.logs.length === 1;
  }, storageKey);
  await assertStoredLogCount(page, 1, "backup undo");
  return {
    status: "passed",
    backupMode: originalPayload.backupMode,
    backupCode: originalPayload.backupCode,
  };
}

async function assertFaceSimulationRendered(page, screenshotName = "face-simulation-card.png") {
  await page.waitForSelector("#faceSimulationCanvas", { state: "visible", timeout: 5000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#faceSimulationCanvas");
    const futureCanvas = document.querySelector("#faceFutureCanvas");
    const fallback = document.querySelector("#faceSimulationFallback");
    const futureFallback = document.querySelector("#faceFutureFallback");
    const effects = Array.from(document.querySelectorAll("#faceSimulationEffects span"));
    const futureItems = Array.from(document.querySelectorAll("#faceFutureStrip span"));
    const title = document.querySelector("#faceSimulationTitle")?.textContent || "";
    const text = document.querySelector("#faceSimulationText")?.textContent || "";
    const futureTitle = document.querySelector("#faceFutureTitle")?.textContent || "";
    const futureRange = document.querySelector("#faceFutureRange")?.textContent || "";
    if (!canvas || canvas.width < 200 || canvas.height < 120) return false;
    if (!futureCanvas || futureCanvas.width < 200 || futureCanvas.height < 100) return false;
    if (!fallback?.classList.contains("hidden")) return false;
    if (!futureFallback?.classList.contains("hidden")) return false;
    if (effects.length < 4) return false;
    if (futureItems.length < 6) return false;
    if (!title.includes("AI 참고") && !title.includes("동선")) return false;
    if (!text.includes("약속") && !text.includes("참고용")) return false;
    if (!futureTitle.includes("14일") || !futureRange.includes("오차")) return false;
    const dataUrl = canvas.toDataURL("image/png");
    const futureDataUrl = futureCanvas.toDataURL("image/png");
    return dataUrl.length > 12000 && futureDataUrl.length > 9000;
  }, null, { timeout: 5000 });
  const canvasMeta = await page.locator("#faceSimulationCanvas").evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height,
    dataUrlLength: canvas.toDataURL("image/png").length,
  }));
  const futureCanvasMeta = await page.locator("#faceFutureCanvas").evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height,
    dataUrlLength: canvas.toDataURL("image/png").length,
  }));
  const effectText = await page.locator("#faceSimulationEffects").innerText();
  if (!effectText.includes("집중 부위") || !effectText.includes("느낌 참고")) {
    throw new Error("face simulation effect cards did not render expected labels");
  }
  const futureText = await page.locator("#faceFutureStrip").innerText();
  if (!futureText.includes("14일 후") || !futureText.includes("확정 아님") || !futureText.includes("오차 범위")) {
    throw new Error("future projection strip did not render expected labels");
  }
  await page.evaluate(() => {
    if (typeof hideToast === "function") hideToast();
  });
  await page.waitForTimeout(100);
  await page.locator(".face-simulation-card").screenshot({
    path: path.join(outDir, screenshotName),
  });
  return {
    status: "passed",
    canvas: canvasMeta,
    futureCanvas: futureCanvasMeta,
    screenshot: screenshotName,
  };
}

async function writeSvgFixture(filename, body) {
  const filler = Array.from({ length: 5000 }, (_, index) => `<!-- fixture-padding-${index} -->`).join("\n");
  const fixturePath = path.join(outDir, filename);
  await fs.writeFile(fixturePath, body.replace("</svg>", `${filler}\n</svg>`));
  return fixturePath;
}

async function createFaceUploadFixture() {
  return writeSvgFixture("face-upload-fixture.svg", `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
  <rect width="720" height="900" fill="#f7efe8"/>
  <ellipse cx="360" cy="405" rx="178" ry="235" fill="#f3c6ad"/>
  <path d="M210 366c42-28 91-38 150-38s108 10 150 38" fill="none" stroke="#7f5a4e" stroke-width="18" stroke-linecap="round"/>
  <ellipse cx="293" cy="405" rx="18" ry="11" fill="#3f352f"/>
  <ellipse cx="427" cy="405" rx="18" ry="11" fill="#3f352f"/>
  <path d="M345 440c-12 34-4 54 30 55" fill="none" stroke="#a56f5f" stroke-width="8" stroke-linecap="round"/>
  <path d="M296 544c40 28 92 28 132 0" fill="none" stroke="#a55057" stroke-width="11" stroke-linecap="round"/>
  <ellipse cx="250" cy="487" rx="36" ry="22" fill="#eaa0a4" opacity=".55"/>
  <ellipse cx="470" cy="487" rx="36" ry="22" fill="#eaa0a4" opacity=".55"/>
  <path d="M252 644c76 74 140 74 216 0" fill="none" stroke="#b78470" stroke-width="18" stroke-linecap="round"/>
  <rect x="196" y="690" width="328" height="120" rx="60" fill="#ead8c9"/>
</svg>`);
}

async function createTransparentGraphicFixture() {
  return writeSvgFixture("transparent-graphic-fixture.svg", `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
  <rect x="245" y="240" width="230" height="230" rx="40" fill="#2f7d72"/>
  <circle cx="360" cy="355" r="72" fill="#8fd0c1"/>
  <path d="M150 675c110-50 310-50 420 0" fill="none" stroke="#2f7d72" stroke-width="34" stroke-linecap="round"/>
</svg>`);
}

async function runFaceCameraSimulationFlow(page) {
  await page.click('.nav-item[data-screen="today"]');
  await page.waitForSelector("#screen-today.active", { timeout: 3000 });
  await page.click("#startFaceScanFromHomeButton");
  await page.waitForSelector("#screen-face-scan.active", { timeout: 3000 });
  await page.click("#startFaceScanCameraButton");
  await page.waitForFunction(() => {
    const video = document.querySelector("#faceScanVideo");
    const capture = document.querySelector("#captureFaceScanButton");
    return video && video.videoWidth > 0 && video.videoHeight > 0 && capture && !capture.disabled;
  }, null, { timeout: 8000 });
  await page.waitForFunction(() => {
    const status = document.querySelector("#faceScanStatus")?.textContent || "";
    const panelStatus = document.querySelector("#screen-face-scan .face-panel")?.dataset.faceStatus || "";
    const capture = document.querySelector("#captureFaceScanButton");
    return panelStatus === "camera-test-pattern"
      && status.includes("브라우저 테스트 카메라")
      && capture?.disabled;
  }, null, { timeout: 9000 });
  if (await page.locator("#screen-face-routine.active").isVisible().catch(() => false)) {
    throw new Error("fake camera unexpectedly advanced to face routine");
  }
  const saved = await getStoredState(page);
  if (saved?.faceGuide?.scanReady || saved?.faceGuide?.scanResult || saved?.faceGuide?.scanImageData) {
    throw new Error("fake camera persisted scan-ready face data");
  }
  const statusText = await page.locator("#faceScanStatus").innerText();
  return {
    status: "passed",
    blocked: true,
    statusText,
  };
}

async function runFaceGraphicUploadBlockFlow(page) {
  await page.click('.nav-item[data-screen="today"]');
  await page.waitForSelector("#screen-today.active", { timeout: 3000 });
  await page.click("#startFaceScanFromHomeButton");
  await page.waitForSelector("#screen-face-scan.active", { timeout: 3000 });
  await page.setInputFiles("#faceUploadInput", await createTransparentGraphicFixture());
  await page.waitForFunction(() => {
    const panelStatus = document.querySelector("#screen-face-scan .face-panel")?.dataset.faceStatus || "";
    const status = document.querySelector("#faceScanStatus")?.textContent || "";
    return panelStatus === "photo-quality-error" && status.includes("동선 기준이 약한 이미지");
  }, null, { timeout: 5000 });
  if (await page.locator("#screen-face-routine.active").isVisible().catch(() => false)) {
    throw new Error("transparent graphic unexpectedly advanced to face routine");
  }
  return {
    status: "passed",
    blocked: true,
    statusText: await page.locator("#faceScanStatus").innerText(),
  };
}

async function runFaceGuideFlow(page) {
  await page.click('.nav-item[data-screen="today"]');
  await page.waitForSelector("#screen-today.active", { timeout: 3000 });
  await page.click("#startFaceScanFromHomeButton");
  await page.waitForSelector("#screen-face-scan.active", { timeout: 3000 });
  await page.setInputFiles("#faceUploadInput", await createFaceUploadFixture());
  await page.waitForSelector("#screen-face-routine.active", { timeout: 5000 });
  const simulation = await assertFaceSimulationRendered(page);
  await page.click("#startFaceGuideButton");
  await page.waitForSelector("#screen-face-guide.active", { timeout: 5000 });
  await page.click("#faceGuideCompleteButton");
  await page.waitForSelector("#screen-face-complete.active", { timeout: 5000 });
  const state = await page.waitForFunction((key) => {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (!Array.isArray(saved?.logs) || saved.logs.length !== 2) return null;
    return saved;
  }, storageKey).then((handle) => handle.jsonValue());
  const latest = state.logs[0];
  if (latest.source !== "face-guide" || !latest.faceGuide) {
    throw new Error("face guide completion did not persist a face-guide log");
  }
  if (latest.photos) {
    throw new Error("face guide completion unexpectedly persisted photos");
  }
  if (state.faceGuide?.scanImageData || JSON.stringify(state.faceGuide || {}).includes("data:image")) {
    throw new Error("persisted face guide state unexpectedly includes scan image data");
  }
  await page.fill("#faceCompleteNote", "기능 smoke 참고 가이드 메모");
  await page.click("#faceCompleteSaveNoteButton");
  await page.waitForFunction((key) => {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return saved?.logs?.[0]?.note === "기능 smoke 참고 가이드 메모";
  }, storageKey);
  return {
    status: "passed",
    source: latest.source,
    hasFaceGuidePayload: Boolean(latest.faceGuide),
    simulation,
  };
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const executablePath = getChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--use-fake-device-for-media-stream",
      "--use-fake-ui-for-media-stream",
    ],
    ...(executablePath ? { executablePath } : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await context.grantPermissions(["camera"], { origin: new URL(baseUrl).origin }).catch(() => {});
  await context.addInitScript((key) => {
    localStorage.removeItem(key);
  }, storageKey);
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const report = {
    baseUrl,
    appUrl,
    generatedAt: new Date().toISOString(),
    status: "failed",
    pageErrors,
    consoleErrors,
    checks: {},
    failures: [],
  };

  try {
    await page.goto(appUrl, { waitUntil: "networkidle" });
    await closeOnboardingIfVisible(page);
    report.checks.manualLog = await runManualLogFlow(page);
    report.checks.backup = await runBackupFlow(page);
    report.checks.faceCamera = await runFaceCameraSimulationFlow(page);
    report.checks.faceGraphicUpload = await runFaceGraphicUploadBlockFlow(page);
    report.checks.faceGuide = await runFaceGuideFlow(page);
    if (pageErrors.length) report.failures.push(`page errors=${pageErrors.length}`);
    if (consoleErrors.length) report.failures.push(`console errors=${consoleErrors.length}`);
  } catch (error) {
    report.failures.push(error.message);
  } finally {
    report.status = report.failures.length ? "failed" : "passed";
    await fs.writeFile(path.join(outDir, "functional-smoke-report.json"), JSON.stringify(report, null, 2));
    await context.close();
    await browser.close();
  }

  console.log(JSON.stringify({
    status: report.status,
    checks: Object.keys(report.checks),
    failures: report.failures,
    pageErrors: pageErrors.length,
    consoleErrors: consoleErrors.length,
  }, null, 2));

  if (report.failures.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

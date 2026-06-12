const fs = require("fs/promises");
const path = require("path");
const { existsSync } = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("[ERROR] playwright package not found for real face model check.");
  process.exit(1);
}

const baseUrl = process.env.REAL_FACE_MODEL_BASE_URL || "http://127.0.0.1:4173/index.html";
const outDir = path.resolve(process.env.REAL_FACE_MODEL_OUT || "output/playwright/20260610-real-model-check");
const fixtureUrl = process.env.REAL_FACE_FIXTURE_URL || "https://storage.googleapis.com/mediapipe-assets/business-person.png";
const fixturePath = process.env.REAL_FACE_FIXTURE_PATH || "";
const storageKey = "gwalsa-routine-state-v1";
const chromeCandidates = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);
const ignoredConsoleErrorPatterns = [
  /^INFO:\s+Created TensorFlow Lite XNNPACK delegate for CPU\.$/,
];

function getChromeExecutable() {
  return chromeCandidates.find((candidate) => existsSync(candidate)) || null;
}

function getProductionUrl(url) {
  const parsed = new URL(url);
  parsed.searchParams.delete("referenceGuide");
  parsed.searchParams.delete("faceGuideMode");
  return parsed.toString();
}

async function getFixtureFile() {
  await fs.mkdir(outDir, { recursive: true });
  if (fixturePath) {
    const absolute = path.resolve(fixturePath);
    if (!existsSync(absolute)) {
      throw new Error(`REAL_FACE_FIXTURE_PATH does not exist: ${absolute}`);
    }
    return absolute;
  }
  if (typeof fetch !== "function") {
    throw new Error("Node fetch is required to download the MediaPipe portrait fixture.");
  }
  const response = await fetch(fixtureUrl);
  if (!response.ok) {
    throw new Error(`fixture download failed: ${response.status} ${response.statusText}`);
  }
  let buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 70 * 1024) {
    buffer = Buffer.concat([buffer, Buffer.alloc((70 * 1024) - buffer.length)]);
  }
  const contentType = response.headers.get("content-type") || "";
  const extension = contentType.includes("png") || fixtureUrl.toLowerCase().endsWith(".png") ? "png" : "jpg";
  const file = path.join(outDir, `mediapipe-face-fixture.${extension}`);
  await fs.writeFile(file, buffer);
  return file;
}

async function createCroppedFixturePayload(page, file) {
  const buffer = await fs.readFile(file);
  const extension = path.extname(file).toLowerCase();
  const mimeType = extension === ".png" ? "image/png" : "image/jpeg";
  const sourceDataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const croppedDataUrl = await page.evaluate(async (dataUrl) => {
    const image = new Image();
    image.src = dataUrl;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
    const cropSize = Math.min(image.width * 0.68, image.height * 0.52);
    const sx = Math.max(0, Math.min(image.width - cropSize, (image.width - cropSize) / 2));
    const sy = Math.max(0, Math.min(image.height - cropSize, image.height * 0.02));
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, sourceDataUrl);
  let croppedBuffer = Buffer.from(croppedDataUrl.split(",")[1], "base64");
  if (croppedBuffer.length < 70 * 1024) {
    croppedBuffer = Buffer.concat([croppedBuffer, Buffer.alloc((70 * 1024) - croppedBuffer.length)]);
  }
  await fs.writeFile(path.join(outDir, "mediapipe-face-crop-fixture.jpg"), croppedBuffer);
  return {
    name: "mediapipe-face-crop-fixture.jpg",
    mimeType: "image/jpeg",
    buffer: croppedBuffer,
  };
}

async function closeOnboardingIfVisible(page) {
  const closeButton = page.locator("#closeOnboardingButton");
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    await page.waitForTimeout(100);
  }
}

async function assertSimulationRendered(page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#faceSimulationCanvas");
    const futureCanvas = document.querySelector("#faceFutureCanvas");
    const fallback = document.querySelector("#faceSimulationFallback");
    const futureFallback = document.querySelector("#faceFutureFallback");
    if (!canvas || !futureCanvas) return false;
    if (!fallback?.classList.contains("hidden")) return false;
    if (!futureFallback?.classList.contains("hidden")) return false;
    return canvas.toDataURL("image/png").length > 12000
      && futureCanvas.toDataURL("image/png").length > 9000;
  }, null, { timeout: 8000 });
}

async function runRealUploadCheck(page, fixtureInput) {
  await page.click("#startFaceScanFromHomeButton");
  await page.waitForSelector("#screen-face-scan.active", { timeout: 5000 });
  await page.setInputFiles("#faceUploadInput", fixtureInput);
  await page.waitForSelector("#screen-face-routine.active", { timeout: 45000 });
  await assertSimulationRendered(page);
  const details = await page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    const faceGuide = typeof state !== "undefined" ? state.faceGuide : (saved?.faceGuide || {});
    const result = faceGuide.scanResult || {};
    const recommendation = faceGuide.recommendation || faceGuide.scanRecommendation || {};
    return {
      scanReady: Boolean(faceGuide.scanReady),
      faceGuideStatus: faceGuide.status,
      source: recommendation.source || null,
      referenceOnly: Boolean(recommendation.referenceOnly),
      sourceReliability: recommendation.sourceReliability || null,
      sourceConfidence: recommendation.sourceConfidence || null,
      provider: result.meta?.provider || null,
      detectorSource: result.meta?.detectorSource || null,
      detectorSourceType: result.meta?.detectorSourceType || null,
      detectionState: result.meta?.detectionState || null,
      delegate: result.meta?.delegate || null,
      pointCount: Number(result.quality?.pointCount || 0),
      landmarkCount: Number(result.meta?.landmarkCount || 0),
      fallbackReason: result.quality?.fallbackReason || result.meta?.fallbackReason || null,
      containsMock: JSON.stringify({ result, recommendation }).toLowerCase().includes("mock"),
      routineTitle: document.querySelector("#faceRoutineTitle")?.textContent || "",
      confidenceText: document.querySelector("#faceRoutineConfidence")?.textContent || "",
    };
  }, storageKey);
  const failures = [];
  if (!details.scanReady) failures.push("scanReady=false");
  if (details.referenceOnly) failures.push("recommendation.referenceOnly=true");
  if (details.source !== "upload-landmark") failures.push(`source=${details.source}`);
  if (details.sourceReliability !== "model") failures.push(`sourceReliability=${details.sourceReliability}`);
  if (details.provider !== "mediapipe") failures.push(`provider=${details.provider}`);
  if (details.detectorSource !== "real") failures.push(`detectorSource=${details.detectorSource}`);
  if (details.detectionState !== "resolved") failures.push(`detectionState=${details.detectionState}`);
  if (details.pointCount < 20) failures.push(`pointCount=${details.pointCount}`);
  if (details.landmarkCount < 100) failures.push(`landmarkCount=${details.landmarkCount}`);
  if (details.containsMock) failures.push("mock marker present in production result");
  if (failures.length) {
    throw new Error(`real upload did not produce a production MediaPipe result: ${failures.join(", ")}`);
  }
  await page.locator("#screen-face-routine").screenshot({ path: path.join(outDir, "after-real-upload.png") });
  return { status: "passed", ...details, screenshot: "after-real-upload.png" };
}

async function runReferenceGateCheck(page) {
  const allowedByGlobal = await page.evaluate(() => {
    window.__GWALSA_ALLOW_REFERENCE_FACE_GUIDE__ = true;
    return typeof allowsReferenceFaceGuide === "function" ? allowsReferenceFaceGuide() : null;
  });
  if (allowedByGlobal !== false) {
    throw new Error("reference guide can be enabled without a QA query");
  }
  return {
    status: "passed",
    allowedByGlobal,
    requiredQuery: "?referenceGuide=1",
  };
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const appUrl = getProductionUrl(baseUrl);
  const fixtureFile = await getFixtureFile();
  const executablePath = getChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-fake-ui-for-media-stream"],
    ...(executablePath ? { executablePath } : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await context.addInitScript((key) => {
    localStorage.removeItem(key);
  }, storageKey);
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !ignoredConsoleErrorPatterns.some((pattern) => pattern.test(text))) {
      consoleErrors.push(text);
    }
  });
  const report = {
    baseUrl,
    appUrl,
    fixtureUrl: fixturePath ? null : fixtureUrl,
    fixtureFile: path.relative(process.cwd(), fixtureFile),
    generatedAt: new Date().toISOString(),
    status: "failed",
    pageErrors,
    consoleErrors,
    checks: {},
    failures: [],
  };
  try {
    const fixtureInput = await createCroppedFixturePayload(page, fixtureFile);
    report.croppedFixtureFile = "output/playwright/20260610-real-model-check/mediapipe-face-crop-fixture.jpg";
    await page.goto(appUrl, { waitUntil: "networkidle" });
    await closeOnboardingIfVisible(page);
    report.checks.referenceGate = await runReferenceGateCheck(page);
    report.checks.realUpload = await runRealUploadCheck(page, fixtureInput);
    if (pageErrors.length) report.failures.push(`page errors=${pageErrors.length}`);
  } catch (error) {
    report.failures.push(error.message);
    await page.screenshot({ path: path.join(outDir, "real-model-check-failure.png"), fullPage: true }).catch(() => {});
    report.failureStatusText = await page.locator("#faceScanStatus").innerText().catch(() => "");
  } finally {
    report.status = report.failures.length ? "failed" : "passed";
    await fs.writeFile(path.join(outDir, "metrics.json"), JSON.stringify(report, null, 2));
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

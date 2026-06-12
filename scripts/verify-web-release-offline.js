const { existsSync } = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("[ERROR] playwright package not found for release offline verification.");
  process.exit(1);
}

const baseUrl = process.env.WEB_RELEASE_BASE_URL;
if (!baseUrl) {
  console.error("[ERROR] WEB_RELEASE_BASE_URL is required.");
  process.exit(1);
}

const chromeCandidates = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

function getChromeExecutable() {
  return chromeCandidates.find((candidate) => existsSync(candidate)) || null;
}

async function waitForServiceWorker(page) {
  await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) {
      throw new Error("serviceWorker unsupported");
    }
    await navigator.serviceWorker.ready;
  });
  await page.reload({ waitUntil: "networkidle" });
  const controlled = await page.evaluate(() => Boolean(navigator.serviceWorker?.controller));
  if (!controlled) {
    throw new Error("service worker did not control the release page after reload");
  }
}

async function main() {
  const executablePath = getChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const publicPages = [
    { file: "privacy-policy.html", heading: "개인정보 처리방침" },
    { file: "terms-disclaimer.html", heading: "이용약관" },
    { file: "support.html", heading: "지원 안내" },
  ];
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await waitForServiceWorker(page);
  const results = {};
  for (const item of publicPages) {
    const pageUrl = new URL(`./public/${item.file}`, baseUrl).toString();
    await page.goto(pageUrl, { waitUntil: "networkidle" });
    const onlineHeading = await page.locator("h1").textContent({ timeout: 3000 });
    if (!onlineHeading || !onlineHeading.includes(item.heading)) {
      throw new Error(`unexpected online ${item.file} heading: ${onlineHeading || "missing"}`);
    }
    results[item.file] = { url: pageUrl, onlineHeading };
  }

  await context.setOffline(true);
  for (const item of publicPages) {
    const pageUrl = results[item.file].url;
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 5000 });
    const offlineHeading = await page.locator("h1").textContent({ timeout: 3000 });
    if (!offlineHeading || !offlineHeading.includes(item.heading)) {
      throw new Error(`unexpected offline ${item.file} heading: ${offlineHeading || "missing"}`);
    }
    const overflowX = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 ||
      document.body.scrollWidth > window.innerWidth + 1
    );
    if (overflowX) {
      throw new Error(`offline ${item.file} page has horizontal overflow`);
    }
    results[item.file].offlineHeading = offlineHeading;
    results[item.file].offline = "ok";
  }
  await context.setOffline(false);
  await browser.close();

  console.log(JSON.stringify({
    baseUrl,
    consoleErrors: consoleErrors.length,
    offlinePublicPages: results,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

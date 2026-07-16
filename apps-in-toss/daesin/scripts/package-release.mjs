import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = dirname(dirname(projectRoot));
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const releaseRoot = join(workspaceRoot, "output", "apps-in-toss", `daesin-ait-rc-${timestamp}`);
const sourceCaptures = join(workspaceRoot, "assets", "daesin", "store");
const consoleAssetsRoot = join(projectRoot, "console", "store-assets");
const artworkScreen = join(consoleAssetsRoot, "03-options-636x1048.png");
const metadataSource = join(projectRoot, "console", "metadata.json");
const iconSource = join(projectRoot, "console", "daesin-app-icon-600.png");

const files = [
  [join(projectRoot, "daesin.ait"), "daesin.ait"],
  [join(projectRoot, "console", "metadata.json"), "console/metadata.json"],
  [join(projectRoot, "console", "README.md"), "console/README.md"],
  [join(projectRoot, "console", "PRIVACY_POLICY_KO.md"), "console/PRIVACY_POLICY_KO.md"],
  [join(projectRoot, "console", "daesin-app-icon-600.png"), "console/daesin-app-icon-600.png"],
  [join(workspaceRoot, "docs", "daesin", "TOSS_RELEASE_READINESS.md"), "TOSS_RELEASE_READINESS.md"],
];

for (const [source] of files) {
  if (!existsSync(source)) throw new Error(`출시 후보 자료가 없습니다: ${source}`);
}

if (!existsSync(consoleAssetsRoot)) throw new Error(`콘솔 제출 자산 폴더가 없습니다: ${consoleAssetsRoot}`);

const consoleAssets = readdirSync(consoleAssetsRoot)
  .filter((name) => name.endsWith(".png"))
  .map((name) => join(consoleAssetsRoot, name));

if (!existsSync(artworkScreen)) throw new Error(`스토어 아트워크 원본 화면이 없습니다: ${artworkScreen}`);

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(releaseRoot, { recursive: true });

for (const [source, target] of files) {
  const destination = join(releaseRoot, target);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination);
}

cpSync(consoleAssetsRoot, join(releaseRoot, "console", "store-assets"), { recursive: true });

if (existsSync(sourceCaptures)) cpSync(sourceCaptures, join(releaseRoot, "reference-captures"), { recursive: true });

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function verifyArchive(file, { allowAitPreamble = false } = {}) {
  const result = spawnSync("unzip", ["-t", file], { encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const aitPreambleOnly = allowAitPreamble
    && result.status === 1
    && output.includes("extra bytes at beginning or within zipfile")
    && output.includes("No errors detected in compressed data");
  if (result.status !== 0 && !aitPreambleOnly) {
    throw new Error(`압축 무결성 검사에 실패했습니다: ${file}\n${output}`);
  }
}

function pngInfo(file) {
  const bytes = readFileSync(file);
  const signature = bytes.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error(`PNG 형식이 아닙니다: ${file}`);
  const colorType = bytes.readUInt8(25);
  const hasTransparencyChunk = bytes.indexOf(Buffer.from("tRNS")) >= 0;
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    hasAlpha: colorType === 4 || colorType === 6 || hasTransparencyChunk,
  };
}

const metadata = JSON.parse(readFileSync(metadataSource, "utf8"));
if (metadata.appName !== "daesin") throw new Error(`metadata appName이 daesin이 아닙니다: ${metadata.appName}`);

const iconInfo = pngInfo(iconSource);
if (iconInfo.width !== 600 || iconInfo.height !== 600 || iconInfo.hasAlpha) {
  throw new Error("콘솔 아이콘은 600x600 불투명 PNG여야 합니다.");
}

const consoleAssetRecords = consoleAssets.map((file) => ({
  file: `console/store-assets/${basename(file)}`,
  bytes: statSync(file).size,
  sha256: sha256(file),
  ...pngInfo(file),
}));

const hasThumbnail = consoleAssetRecords.some(({ width, height }) => width === 1932 && height === 828);
const verticalScreenshotCount = consoleAssetRecords.filter(({ width, height }) => width === 636 && height === 1048).length;
const hasHorizontalScreenshot = consoleAssetRecords.some(({ width, height }) => width === 1504 && height === 741);

if (!hasThumbnail || (verticalScreenshotCount < 3 && !hasHorizontalScreenshot)) {
  throw new Error("1932x828 썸네일과 636x1048 세로 3장 이상 또는 1504x741 가로 1장 이상이 필요합니다.");
}

const artifact = join(releaseRoot, "daesin.ait");
verifyArchive(artifact, { allowAitPreamble: true });

const supportEmailPending = metadata.support?.email === "CONFIRM_OWNED_SUPPORT_EMAIL_BEFORE_SUBMIT";
const releaseStatus = supportEmailPending ? "blocked-owner-input" : "pre-review-ready";
const manifest = {
  appName: "daesin",
  miniAppId: metadata.miniAppId,
  status: releaseStatus,
  generatedAt: new Date().toISOString(),
  artifact: {
    file: "daesin.ait",
    bytes: statSync(artifact).size,
    sha256: sha256(artifact),
  },
  included: files.map(([, target]) => target),
  consoleAssets: consoleAssetRecords,
  icon: {
    file: "console/daesin-app-icon-600.png",
    bytes: statSync(iconSource).size,
    sha256: sha256(iconSource),
    ...iconInfo,
  },
  referenceCaptures: existsSync(sourceCaptures) ? "reference-captures (not console-submission sized)" : "not included",
  manualFinalizationRequired: [
    "콘솔 고객 문의 이메일을 실제 소유 정보로 확정",
    "앱 정보 법적 확인 체크박스는 소유자가 직접 확인",
    "토스 콘솔 앱 등록 뒤 QR 실기기 테스트를 1회 이상 완료",
    "앱 정보 및 번들 검토 요청 버튼은 최종 승인 전 누르지 않음",
  ],
};

writeFileSync(join(releaseRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
const archive = `${releaseRoot}.zip`;
execFileSync("zip", ["-qr", archive, basename(releaseRoot)], { cwd: dirname(releaseRoot), stdio: "inherit" });
verifyArchive(archive);
const archiveSha256 = sha256(archive);
writeFileSync(`${archive}.sha256`, `${archiveSha256}  ${basename(archive)}\n`);
writeFileSync(join(dirname(releaseRoot), "latest-daesin-ait-rc.json"), `${JSON.stringify({
  appName: "daesin",
  miniAppId: metadata.miniAppId,
  status: releaseStatus,
  generatedAt: manifest.generatedAt,
  archive: basename(archive),
  bytes: statSync(archive).size,
  sha256: archiveSha256,
}, null, 2)}\n`);
console.log(`DAESIN AIT release-candidate materials → ${archive}`);

function basename(path) {
  return path.slice(path.lastIndexOf("/") + 1);
}

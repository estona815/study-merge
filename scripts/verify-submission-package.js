#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const expected = {
  appBuild: "20260612a06",
  serviceWorkerCache: "gwalsa-routine-v20260612a06",
  webPackage: "gwalsa-web-pwa-20260610-100147",
  webZip: "output/release/gwalsa-web-pwa-20260610-100147.zip",
  webZipSha256: "4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0",
  storePackage: "gwalsa-store-assets-20260610-100154",
  storeZip: "output/store-assets/gwalsa-store-assets-20260610-100154.zip",
  storeZipSha256: "0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4",
  realModelMetrics: "output/playwright/20260610-real-model-check/metrics.json",
  officialNoticePdf: "output/submission/ict-smart-device/official-forms/2026-ondeviceai-official-notice.pdf",
  officialNoticePdfSha256: "0b2a44e4178b18f89d074c0d007ca1207f2cb55088d206cf5f8961967da98ff7",
  officialGeneralForm: "output/submission/ict-smart-device/official-forms/application-general.docx",
  officialGeneralFormSha256: "31ed42260aee3c96afb9d3a8eb98c497fb343734171d44218ccfb6a4892981f4",
  officialCompanyForm: "output/submission/ict-smart-device/official-forms/application-company.docx",
  officialCompanyFormSha256: "a4a7cb574119001bee5adb4c0ab0541b4290b3fd346cf2fe3811f4906b9b92ff",
};

const requiredFiles = [
  "docs/submissions/README.md",
  "docs/submissions/external-info-template.md",
  "docs/submissions/common/fact-sheet.md",
  "docs/submissions/common/qa-summary.md",
  "docs/submissions/common/privacy-safety-summary.md",
  "docs/submissions/common/forbidden-claims-checklist.md",
  "docs/submissions/seoul-beauty-week/README.md",
  "docs/submissions/seoul-beauty-week/submission-brief.md",
  "docs/submissions/seoul-beauty-week/privacy-safety-summary.md",
  "docs/submissions/seoul-beauty-week/qa-evidence.md",
  "docs/submissions/seoul-beauty-week/copy-claims-checklist.md",
  "docs/submissions/seoul-beauty-week/submission-assets-checklist.md",
  "docs/submissions/apps-in-toss/README.md",
  "docs/submissions/apps-in-toss/miniapp-brief.md",
  "docs/submissions/apps-in-toss/porting-checklist.md",
  "docs/submissions/apps-in-toss/monetization-checklist.md",
  "docs/submissions/apps-in-toss/privacy-safety-summary.md",
  "docs/submissions/apps-in-toss/qa-evidence.md",
  "docs/submissions/apps-in-toss/copy-claims-checklist.md",
  "docs/submissions/ict-smart-device/README.md",
  "docs/submissions/ict-smart-device/submission-brief.md",
  "docs/submissions/ict-smart-device/technical-readiness.md",
  "docs/submissions/ict-smart-device/privacy-safety-summary.md",
  "docs/submissions/ict-smart-device/qa-evidence.md",
  "docs/submissions/ict-smart-device/copy-claims-checklist.md",
  "docs/submissions/ict-smart-device/submission-assets-checklist.md",
  "docs/submissions/ict-smart-device/official-notice-research.md",
  "docs/submissions/ict-smart-device/external-info-status.md",
  "docs/submissions/ict-smart-device/form-answer-draft.md",
  "docs/submissions/ict-smart-device/technical-proposal.md",
  "docs/submissions/ict-smart-device/innovation-summary.md",
  "docs/submissions/ict-smart-device/validation-evidence.md",
  "docs/submissions/ict-smart-device/demo-access.md",
  "docs/submissions/ict-smart-device/final-submit-checklist.md",
  "output/submission/ict-smart-device/README.md",
  "output/submission/ict-smart-device/official-notice-research.md",
  "output/submission/ict-smart-device/external-info-status.md",
  "output/submission/ict-smart-device/form-answer-draft.md",
  "output/submission/ict-smart-device/technical-proposal.md",
  "output/submission/ict-smart-device/innovation-summary.md",
  "output/submission/ict-smart-device/validation-evidence.md",
  "output/submission/ict-smart-device/privacy-safety-summary.md",
  "output/submission/ict-smart-device/submission-checklist.md",
  "output/submission/ict-smart-device/release-hashes.txt",
  expected.officialNoticePdf,
  expected.officialGeneralForm,
  expected.officialCompanyForm,
  expected.webZip,
  expected.storeZip,
  expected.realModelMetrics,
];

const requiredDocPhrases = {
  "docs/submissions/README.md": [
    "일반 뷰티 셀프케어 PWA",
    "mock/reference 경로는 QA 전용",
    expected.realModelMetrics,
  ],
  "docs/submissions/external-info-template.md": [
    "Official website URL",
    "https://www.ondeviceai.or.kr/",
    "2026-06-30 24:00",
    "Hosted privacy URL",
    "Submission-Day Checks",
  ],
  "docs/submissions/ict-smart-device/README.md": [
    "온디바이스/브라우저 로컬",
    "MediaPipe Face Landmarker",
    "mock/reference는 QA 전용",
  ],
  "docs/submissions/ict-smart-device/submission-brief.md": [
    "일반 뷰티 셀프케어 PWA",
    "MediaPipe Face Landmarker",
    "production 성공 기준은 real MediaPipe",
  ],
  "docs/submissions/ict-smart-device/technical-readiness.md": [
    "Production success must be described with the real MediaPipe path",
    "referenceOnly=false",
    "not production success criteria",
  ],
  "docs/submissions/ict-smart-device/privacy-safety-summary.md": [
    "일반 뷰티 셀프케어 PWA",
    "referenceOnly=false",
    "mock/reference evidence is QA-only",
  ],
  "docs/submissions/ict-smart-device/qa-evidence.md": [
    "mock/reference evidence is QA-only",
    "provider=mediapipe",
    "containsMock=false",
  ],
  "docs/submissions/ict-smart-device/copy-claims-checklist.md": [
    "MediaPipe Face Landmarker based reference route display",
    "mock/reference as QA-only",
    "not a production success basis",
  ],
  "docs/submissions/ict-smart-device/submission-assets-checklist.md": [
    "Submitted QA evidence uses real MediaPipe production path",
    "mock/reference clearly labeled QA-only",
    "Existing release/store artifacts were not regenerated",
  ],
  "docs/submissions/ict-smart-device/official-notice-research.md": [
    "https://www.ondeviceai.or.kr/",
    "2026-06-30 24:00",
    "HWP or PDF",
    "100MB",
  ],
  "docs/submissions/ict-smart-device/external-info-status.md": [
    "2026년 ICT 스마트 디바이스 전국 공모전",
    "Owner Inputs Still Required",
    "No working public demo URL",
  ],
  "docs/submissions/ict-smart-device/form-answer-draft.md": [
    "일반 뷰티 셀프케어 PWA",
    "referenceOnly=false",
    "의료 목적 아님",
    "보장 불가",
  ],
  "docs/submissions/ict-smart-device/technical-proposal.md": [
    expected.appBuild,
    "MediaPipe Face Landmarker",
    "referenceOnly=false",
    "localStorage",
  ],
  "docs/submissions/ict-smart-device/validation-evidence.md": [
    expected.webZipSha256,
    "provider=mediapipe",
    "containsMock=false",
  ],
  "docs/submissions/ict-smart-device/final-submit-checklist.md": [
    "2026-06-30 24:00",
    "Owner explicitly approves pressing final submit/save",
    "No guaranteed-result or appearance-change promise",
  ],
};

const riskPatterns = [
  { label: "medical claim", regex: /\bmedical\b|의료/i },
  { label: "diagnostic claim", regex: /\bdiagnos(?:e|is|tic)\b|진단/i },
  { label: "treatment claim", regex: /\btreatment\b|\btreats\b|\btreated\b|\bcure\b|\brecovery\b|치료/i },
  { label: "disease-prevention claim", regex: /disease[- ]prevention|prevent(?:s|ion)?\s+disease|질병\s*예방/i },
  { label: "guaranteed-result claim", regex: /\bguarantee(?:d|s)?\b|결과\s*보장|효과\s*보장|보장\s*효과/i },
  { label: "before-after proof claim", regex: /before\/after proof|전후\s*(?:변화|효과|개선)\s*(?:증명|입증|보장|확정|단정)/i },
  { label: "appearance promise", regex: /외모\s*변화\s*(?:약속|보장|확정|단정)|visible\s+change\s+(?:promise|guarantee)/i },
];

const allowedContextPattern = /금지|피해야|avoid|do not|must not|does not|not a|not describe|no |without|forbidden|removed|검수|제한|경계|guardrail|claim|claims|copy review|submission-day checks|사용하지|않는다|않음|아님|아닌|불가|전용|QA-only|not production|not a production|not submitted|not prove/i;

const failures = [];
const warnings = [];

function relPath(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function abs(rel) {
  return path.join(root, rel);
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readText(rel) {
  return fs.readFileSync(abs(rel), "utf8");
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function hashFile(rel) {
  return crypto.createHash("sha256").update(fs.readFileSync(abs(rel))).digest("hex");
}

function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, predicate, out);
    } else if (!predicate || predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function recentContextAllows(lines, index) {
  const start = Math.max(0, index - 8);
  const context = lines.slice(start, index + 1).join("\n");
  return allowedContextPattern.test(context);
}

function verifyRequiredFiles() {
  for (const file of requiredFiles) {
    const filePath = abs(file);
    assert(fs.existsSync(filePath), `Missing required file: ${file}`);
    if (fs.existsSync(filePath)) {
      assert(fs.statSync(filePath).size > 0, `Required file is empty: ${file}`);
    }
  }
}

function verifyDocPhrases() {
  for (const [file, phrases] of Object.entries(requiredDocPhrases)) {
    if (!fs.existsSync(abs(file))) continue;
    const text = readText(file);
    for (const phrase of phrases) {
      assert(text.includes(phrase), `Missing phrase in ${file}: ${phrase}`);
    }
  }
}

function verifyArtifacts() {
  if (fs.existsSync(abs(expected.webZip))) {
    assert(hashFile(expected.webZip) === expected.webZipSha256, `Web zip SHA-256 mismatch: ${expected.webZip}`);
  }
  if (fs.existsSync(abs(expected.storeZip))) {
    assert(hashFile(expected.storeZip) === expected.storeZipSha256, `Store assets zip SHA-256 mismatch: ${expected.storeZip}`);
  }
  if (fs.existsSync(abs(expected.officialNoticePdf))) {
    assert(hashFile(expected.officialNoticePdf) === expected.officialNoticePdfSha256, `Official notice PDF SHA-256 mismatch: ${expected.officialNoticePdf}`);
  }
  if (fs.existsSync(abs(expected.officialGeneralForm))) {
    assert(hashFile(expected.officialGeneralForm) === expected.officialGeneralFormSha256, `Official general form SHA-256 mismatch: ${expected.officialGeneralForm}`);
  }
  if (fs.existsSync(abs(expected.officialCompanyForm))) {
    assert(hashFile(expected.officialCompanyForm) === expected.officialCompanyFormSha256, `Official company form SHA-256 mismatch: ${expected.officialCompanyForm}`);
  }

  const releaseManifestPath = `output/release/${expected.webPackage}/release/release-manifest.json`;
  if (fs.existsSync(abs(releaseManifestPath))) {
    const manifest = readJson(releaseManifestPath);
    assert(manifest.packageName === expected.webPackage, "Web release manifest packageName mismatch");
    assert(manifest.appBuild === expected.appBuild, "Web release manifest appBuild mismatch");
    assert(manifest.serviceWorkerCache === expected.serviceWorkerCache, "Web release manifest serviceWorkerCache mismatch");
  } else {
    failures.push(`Missing web release manifest: ${releaseManifestPath}`);
  }

  const storeManifestPath = `output/store-assets/${expected.storePackage}/store-assets/store-asset-manifest.json`;
  if (fs.existsSync(abs(storeManifestPath))) {
    const manifest = readJson(storeManifestPath);
    assert(manifest.packageName === expected.storePackage, "Store asset manifest packageName mismatch");
    assert(manifest.appBuild === expected.appBuild, "Store asset manifest appBuild mismatch");
    assert(manifest.serviceWorkerCache === expected.serviceWorkerCache, "Store asset manifest serviceWorkerCache mismatch");
    assert(manifest.status === "review-assets-ready", "Store asset manifest status is not review-assets-ready");
  } else {
    failures.push(`Missing store asset manifest: ${storeManifestPath}`);
  }
}

function verifyRealModelMetrics() {
  if (!fs.existsSync(abs(expected.realModelMetrics))) return;

  const metrics = readJson(expected.realModelMetrics);
  const realUpload = metrics.checks?.realUpload || {};
  const referenceGate = metrics.checks?.referenceGate || {};

  assert(metrics.status === "passed", "Real model metrics status is not passed");
  assert((metrics.pageErrors || []).length === 0, "Real model metrics contain page errors");
  assert(referenceGate.status === "passed", "Reference gate did not pass");
  assert(referenceGate.allowedByGlobal === false, "Reference guide can be enabled without QA query");
  assert(realUpload.status === "passed", "Real upload check did not pass");
  assert(realUpload.provider === "mediapipe", `Real upload provider mismatch: ${realUpload.provider || "missing"}`);
  assert(realUpload.detectorSource === "real", `Real upload detectorSource mismatch: ${realUpload.detectorSource || "missing"}`);
  assert(realUpload.source === "upload-landmark", `Real upload source mismatch: ${realUpload.source || "missing"}`);
  assert(realUpload.referenceOnly === false, "Real upload is marked referenceOnly");
  assert(realUpload.containsMock === false, "Real upload contains mock marker");
  assert(Number(realUpload.landmarkCount || 0) >= 400, "Real upload landmarkCount looks incomplete");
  assert(Number(realUpload.pointCount || 0) >= 50, "Real upload pointCount looks incomplete");
}

function verifyClaims() {
  const markdownFiles = [
    ...walk(abs("docs/submissions"), (file) => file.endsWith(".md")),
    ...(fs.existsSync(abs("output/submission/ict-smart-device"))
      ? walk(abs("output/submission/ict-smart-device"), (file) => file.endsWith(".md"))
      : []),
  ];
  for (const filePath of markdownFiles) {
    const rel = relPath(filePath);
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      for (const pattern of riskPatterns) {
        if (!pattern.regex.test(trimmed)) continue;
        if (recentContextAllows(lines, index)) continue;
        warnings.push(`${rel}:${index + 1}: review possible ${pattern.label}: ${trimmed}`);
      }
    });
  }
}

function verifySubmissionTodos() {
  const reviewFiles = [
    ...walk(abs("docs/submissions/ict-smart-device"), (file) => file.endsWith(".md")),
    ...(fs.existsSync(abs("output/submission/ict-smart-device"))
      ? walk(abs("output/submission/ict-smart-device"), (file) => file.endsWith(".md"))
      : []),
    abs("docs/submissions/external-info-template.md"),
  ];
  let todoCount = 0;
  for (const filePath of reviewFiles) {
    const rel = relPath(filePath);
    const text = fs.readFileSync(filePath, "utf8");
    const matches = text.match(/\bTODO\b|Owner to fill|owner input|확인 필요/gi) || [];
    todoCount += matches.length;
    if (matches.length) warnings.push(`${rel}: ${matches.length} owner/TODO markers remain before final submission`);
  }

  assert(todoCount > 0, "Expected owner-provided TODO markers are missing; legal/contact fields may have been overfilled");
}

function verifyNoReleaseRegenerationSideEffects() {
  const latestRelease = "output/release/latest-web-release.json";
  const latestStore = "output/store-assets/latest-store-assets.json";
  if (fs.existsSync(abs(latestRelease))) {
    const data = readJson(latestRelease);
    const serialized = JSON.stringify(data);
    assert(serialized.includes(expected.webPackage), "Latest web release pointer no longer references expected package");
  }
  if (fs.existsSync(abs(latestStore))) {
    const data = readJson(latestStore);
    const serialized = JSON.stringify(data);
    assert(serialized.includes(expected.storePackage), "Latest store asset pointer no longer references expected package");
  }
}

function main() {
  verifyRequiredFiles();
  verifyDocPhrases();
  verifyArtifacts();
  verifyRealModelMetrics();
  verifyClaims();
  verifySubmissionTodos();
  verifyNoReleaseRegenerationSideEffects();

  if (warnings.length) {
    console.log("Submission package verification warnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  }

  if (failures.length) {
    console.error("Submission package verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Submission package verification passed.");
  console.log(`Checked ${requiredFiles.length} required files and baseline artifacts.`);
  console.log(`Real model QA: ${expected.realModelMetrics}`);
}

main();

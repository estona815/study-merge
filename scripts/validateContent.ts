import { getSubjectCatalog } from "../src/data/subjectCatalog";
import { SAMPLE_UNITS } from "../src/data/sampleContent";
import { validateStudyContent } from "../src/validation/contentValidator";

const report = validateStudyContent({
  subjects: getSubjectCatalog(),
  units: SAMPLE_UNITS,
});

console.log("Study Merge content validation");
console.log(
  `Structural errors: ${report.structuralErrorCount} | Release blockers: ${report.releaseBlockerCount} | Warnings: ${report.warningCount}`,
);

if (report.findings.length > 0) {
  console.log("");
  for (const finding of report.findings) {
    console.log(
      `[${finding.severity}] ${finding.code} :: ${finding.path}\n  ${finding.message}`,
    );
  }
}

if (!report.isStructurallyValid) {
  console.error("\nContent structure validation failed.");
  process.exit(1);
}

if (!report.isReleaseReady) {
  console.error(
    "\nContent structure is valid, but release-readiness metadata is incomplete.",
  );
  process.exit(1);
}

console.log("\nContent validation passed.");

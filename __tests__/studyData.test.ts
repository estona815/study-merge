import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getContentSummary, getSubjectCatalog } from "../src/data/subjectCatalog";
import { getSubjectUnits } from "../src/data/sampleContent";

describe("studyData", () => {
  it("expands content volume beyond the launch-review target", () => {
    const summary = getContentSummary();

    assert.equal(summary.subjectCount, 22);
    assert.equal(summary.unitCount, 396);
    assert.ok(summary.conceptCount >= 5000);
    assert.ok(summary.quizCount >= 1900);
  });

  it("keeps every subject playable with a large unit roster", () => {
    const subjects = getSubjectCatalog();

    for (const subject of subjects) {
      const units = getSubjectUnits(subject.id);

      assert.equal(units.length, 18);
      assert.equal(subject.unitIds.length, 18);
      assert.ok(subject.totalConcepts >= 270);
      assert.ok(subject.totalQuizzes >= 90);
      assert.ok(units.every((unit) => unit.concepts.length >= 15));
    }
  });
});

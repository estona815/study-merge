import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  calculateReviewPriority,
  getNextReviewAt,
  getReviewLabel,
} from "../src/engine/spacedRepetition";

describe("spaced repetition helpers", () => {
  it("raises priority when wrong counts increase", () => {
    const low = calculateReviewPriority({
      wrongCount: 1,
      mastery: 70,
      examImportance: 3,
      lastReviewedAt: "2026-06-26T00:00:00.000Z",
      now: new Date("2026-06-27T00:00:00.000Z"),
    });
    const high = calculateReviewPriority({
      wrongCount: 4,
      mastery: 70,
      examImportance: 3,
      lastReviewedAt: "2026-06-26T00:00:00.000Z",
      now: new Date("2026-06-27T00:00:00.000Z"),
    });

    assert.ok(high > low);
  });

  it("raises priority for older reviews and lower mastery", () => {
    const fresh = calculateReviewPriority({
      wrongCount: 1,
      mastery: 80,
      examImportance: 2,
      lastReviewedAt: "2026-06-26T00:00:00.000Z",
      now: new Date("2026-06-27T00:00:00.000Z"),
    });
    const staleAndWeak = calculateReviewPriority({
      wrongCount: 1,
      mastery: 30,
      examImportance: 2,
      lastReviewedAt: "2026-06-10T00:00:00.000Z",
      now: new Date("2026-06-27T00:00:00.000Z"),
    });

    assert.ok(staleAndWeak > fresh);
  });

  it("returns labels and next review dates based on priority", () => {
    assert.equal(getReviewLabel(20, 3), "시험 전 집중 복습");
    assert.equal(getReviewLabel(13, 1), "오늘 저녁 다시 보기");
    assert.equal(getReviewLabel(6, 0), "오늘 다시 보기");

    const next = getNextReviewAt(20, new Date("2026-06-27T00:00:00.000Z"));
    assert.equal(next, "2026-06-27T02:00:00.000Z");
  });
});

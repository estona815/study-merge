import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { shouldPauseGameForAppStateChange } from "../src/appLifecycle";
import { GameSession } from "../src/types/models";

const activeGame: GameSession = {
  subjectId: "subject-1",
  unitId: "unit-1",
  focusPreset: "highSchool",
  difficulty: "easy",
  boardSize: 4,
  board: Array.from({ length: 16 }, () => null),
  score: 0,
  combo: 0,
  bestCombo: 0,
  turns: 0,
  nextTileId: 1,
  pendingQuizzes: [],
  pendingSpawnCount: 0,
  remainingSeconds: 120,
  elapsedSeconds: 0,
  paused: false,
  startedAt: "2026-06-28T00:00:00.000Z",
  correctAnswers: 0,
  wrongAnswers: 0,
  learnedConceptIds: [],
  weakConceptIds: [],
};

describe("appLifecycle", () => {
  it("pauses only when an active session moves to inactive or background", () => {
    assert.equal(shouldPauseGameForAppStateChange("inactive", activeGame), true);
    assert.equal(shouldPauseGameForAppStateChange("background", activeGame), true);
    assert.equal(shouldPauseGameForAppStateChange("active", activeGame), false);
    assert.equal(
      shouldPauseGameForAppStateChange("inactive", { ...activeGame, paused: true }),
      false,
    );
    assert.equal(shouldPauseGameForAppStateChange("background", undefined), false);
  });
});

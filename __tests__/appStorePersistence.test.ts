import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPersistedAppStoreState,
  restorePersistedAppStoreState,
} from "../src/store/appStorePersistence";

describe("appStorePersistence", () => {
  it("persists currentGame and restores it as paused", () => {
    const persisted = buildPersistedAppStoreState({
      onboardingComplete: true,
      selectedMode: "highSchool",
      focusPreset: "highSchool",
      selectedSubjectId: "subject-1",
      selectedUnitId: "unit-1",
      subjectSearch: "",
      subjectFilter: "all",
      difficulty: "easy",
      goal: "habit",
      masteryByConceptId: { "concept-1": 60 },
      subjectProgress: {},
      reviewQueue: [],
      sessionHistory: [],
      currentGame: {
        subjectId: "subject-1",
        unitId: "unit-1",
        focusPreset: "highSchool",
        difficulty: "easy",
        boardSize: 4,
        board: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        score: 10,
        combo: 1,
        bestCombo: 1,
        turns: 2,
        nextTileId: 3,
        pendingQuizzes: [],
        pendingSpawnCount: 0,
        remainingSeconds: 120,
        elapsedSeconds: 30,
        paused: false,
        startedAt: "2026-06-28T00:00:00.000Z",
        correctAnswers: 1,
        wrongAnswers: 0,
        learnedConceptIds: ["concept-1"],
        weakConceptIds: [],
      },
      lastResult: undefined,
      streakDays: 2,
      lastStudyDate: "2026-06-28",
    });

    const restored = restorePersistedAppStoreState(persisted);

    assert.equal(restored.currentGame?.paused, true);
    assert.equal(restored.activeScreen, "game");
    assert.deepEqual(restored.currentGame?.learnedConceptIds, ["concept-1"]);
  });

  it("restores result, review, and stats data without mutating active session state", () => {
    const restored = restorePersistedAppStoreState({
      onboardingComplete: true,
      selectedMode: "certification",
      focusPreset: "wrongAnswers",
      selectedSubjectId: "subject-1",
      selectedUnitId: "unit-1",
      subjectSearch: "안전",
      subjectFilter: "certification",
      difficulty: "hard",
      goal: "mastery",
      masteryByConceptId: { "concept-1": 35 },
      subjectProgress: {
        "subject-1": {
          subjectId: "subject-1",
          sessions: 3,
          correctAnswers: 9,
          wrongAnswers: 2,
          studySeconds: 420,
          masteryByUnit: { "unit-1": 78 },
        },
      },
      reviewQueue: [
        {
          id: "review-1",
          subjectId: "subject-1",
          unitId: "unit-1",
          conceptId: "concept-1",
          prompt: "질문",
          explanation: "설명",
          sourceTitles: ["원인 1", "원인 2"],
          incorrectCount: 1,
          mastery: 35,
          reviewPriority: 14,
          nextReviewLabel: "오늘 저녁 다시 보기",
          createdAt: "2026-06-28T00:00:00.000Z",
        },
      ],
      sessionHistory: [
        {
          id: "session-1",
          subjectId: "subject-1",
          unitId: "unit-1",
          focusPreset: "highSchool",
          difficulty: "easy",
          score: 100,
          correctAnswers: 3,
          wrongAnswers: 1,
          durationSeconds: 120,
          completedAt: "2026-06-28T00:00:00.000Z",
        },
      ],
      currentGame: undefined,
      lastResult: {
        subjectId: "subject-1",
        subjectName: "테스트",
        unitId: "unit-1",
        unitTitle: "단원",
        focusPreset: "highSchool",
        difficulty: "easy",
        score: 200,
        correctAnswers: 4,
        wrongAnswers: 1,
        bestCombo: 2,
        studiedConceptCount: 3,
        weakConceptIds: ["concept-1"],
        recommendedNextStep: "복습 진행",
        durationSeconds: 180,
        reason: "clear",
        completedAt: "2026-06-28T00:00:00.000Z",
      },
      streakDays: 5,
      lastStudyDate: "2026-06-28",
    });

    assert.equal(restored.activeScreen, "result");
    assert.equal(restored.reviewQueue.length, 1);
    assert.equal(restored.sessionHistory.length, 1);
    assert.equal(restored.subjectProgress["subject-1"]?.sessions, 3);
    assert.deepEqual(restored.lastResult?.weakConceptIds, ["concept-1"]);
  });
});

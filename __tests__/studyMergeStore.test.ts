import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { getSubjectUnits } from "../src/data/sampleContent";
import { getQuizById } from "../src/engine/gameEngine";
import { BoardCell, Quiz, Tile, UnitContent } from "../src/types/models";

class MemoryLocalStorage {
  private store = new Map<string, string>();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number) {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  get length() {
    return this.store.size;
  }
}

const storage = new MemoryLocalStorage();
Object.defineProperty(globalThis, "window", {
  value: {
    localStorage: storage,
  },
  configurable: true,
});

let useAppStore: (typeof import("../src/store/useAppStore"))["useAppStore"];

function resetStore() {
  storage.clear();
  assert.ok(useAppStore);
  useAppStore.setState({
    activeScreen: "onboarding",
    onboardingComplete: false,
    selectedMode: "highSchool",
    focusPreset: "highSchool",
    selectedSubjectId: undefined,
    selectedUnitId: undefined,
    subjectSearch: "",
    subjectFilter: "all",
    difficulty: "easy",
    goal: "habit",
    masteryByConceptId: {},
    subjectProgress: {},
    reviewQueue: [],
    sessionHistory: [],
    currentGame: undefined,
    lastResult: undefined,
    streakDays: 0,
    lastStudyDate: undefined,
  });
}

function makeTileFromConcept(instanceId: string, unit: UnitContent, conceptIndex = 0): Tile {
  const concept = unit.concepts[conceptIndex];
  assert.ok(concept);
  return {
    instanceId,
    conceptId: concept.id,
    title: concept.title,
    blockType: concept.blockType,
    mergeGroupId: concept.mergeGroupId,
    stage: concept.stage,
    isTrap: concept.isTrap,
  };
}

function getWrongResponse(quiz: Quiz) {
  if (quiz.type === "ox") {
    return !quiz.correctAnswer;
  }

  if (quiz.type === "multipleChoice") {
    return quiz.options.find((option) => option.id !== quiz.correctOptionId)?.id ?? "";
  }

  if (quiz.type === "fillBlank") {
    return "틀린답";
  }

  const wrong = Object.fromEntries(quiz.pairs.map((pair) => [pair.left, quiz.choices[0] ?? ""]));
  if (quiz.pairs.every((pair) => wrong[pair.left] === pair.right)) {
    wrong[quiz.pairs[0]!.left] = "완전히다른선택지";
  }
  return wrong;
}

function getCorrectResponse(quiz: Quiz) {
  if (quiz.type === "ox") {
    return quiz.correctAnswer;
  }

  if (quiz.type === "multipleChoice") {
    return quiz.correctOptionId;
  }

  if (quiz.type === "fillBlank") {
    return quiz.acceptableAnswers[0] ?? "";
  }

  return Object.fromEntries(quiz.pairs.map((pair) => [pair.left, pair.right]));
}

beforeEach(async () => {
  if (!useAppStore) {
    ({ useAppStore } = await import("../src/store/useAppStore"));
  }

  resetStore();
});

describe("studyMerge store session logic", () => {
  it("does not advance the timer while paused", () => {
    const unit = getSubjectUnits("korean-history")[0];
    assert.ok(unit);

    useAppStore.getState().startGame(unit.id);
    useAppStore.getState().pauseGame();
    const before = useAppStore.getState().currentGame?.remainingSeconds;

    useAppStore.getState().tickGameTimer();

    const after = useAppStore.getState().currentGame?.remainingSeconds;
    assert.equal(after, before);
  });

  it("finishes a game into the result screen and clears currentGame", () => {
    const unit = getSubjectUnits("korean-history")[0];
    assert.ok(unit);

    useAppStore.getState().startGame(unit.id);
    useAppStore.getState().finishGame("quit");

    const state = useAppStore.getState();
    assert.equal(state.currentGame, undefined);
    assert.equal(state.activeScreen, "result");
    assert.equal(state.lastResult?.unitId, unit.id);
    assert.equal(state.sessionHistory.length, 1);
  });

  it("adds wrong quiz answers to the review queue", () => {
    const unit = getSubjectUnits("korean-history")[0];
    assert.ok(unit);

    const board: BoardCell[] = [
      makeTileFromConcept("tile-1", unit, 0),
      makeTileFromConcept("tile-2", unit, 1),
      ...Array.from({ length: 14 }, () => null),
    ];

    useAppStore.setState({
      activeScreen: "game",
      selectedSubjectId: unit.subjectId,
      selectedUnitId: unit.id,
      currentGame: {
        subjectId: unit.subjectId,
        unitId: unit.id,
        focusPreset: "highSchool",
        difficulty: "easy",
        boardSize: 4,
        board,
        score: 0,
        combo: 0,
        bestCombo: 0,
        turns: 0,
        nextTileId: 3,
        pendingQuizzes: [],
        pendingSpawnCount: 0,
        remainingSeconds: 300,
        elapsedSeconds: 0,
        paused: false,
        startedAt: "2026-06-28T00:00:00.000Z",
        correctAnswers: 0,
        wrongAnswers: 0,
        learnedConceptIds: [],
        weakConceptIds: [],
      },
    });

    useAppStore.getState().move("left");
    const pendingQuiz = useAppStore.getState().currentGame?.pendingQuizzes[0];
    assert.ok(pendingQuiz);
    const quiz = getQuizById(unit, pendingQuiz.quizId);
    assert.ok(quiz);

    useAppStore.getState().submitQuiz(getWrongResponse(quiz));

    const state = useAppStore.getState();
    assert.equal(state.reviewQueue.length, 1);
    assert.equal(state.currentGame?.wrongAnswers, 1);
    assert.equal(state.currentGame?.combo, 0);
  });

  it("updates mastery, score, and combo after a correct merge quiz", () => {
    const unit = getSubjectUnits("korean-history")[0];
    assert.ok(unit);

    const leftConcept = unit.concepts[0];
    const rightConcept = unit.concepts[1];
    assert.ok(leftConcept);
    assert.ok(rightConcept);

    useAppStore.setState({
      activeScreen: "game",
      selectedSubjectId: unit.subjectId,
      selectedUnitId: unit.id,
      masteryByConceptId: {
        [leftConcept.id]: 50,
        [rightConcept.id]: 50,
      },
      currentGame: {
        subjectId: unit.subjectId,
        unitId: unit.id,
        focusPreset: "highSchool",
        difficulty: "easy",
        boardSize: 4,
        board: [
          makeTileFromConcept("tile-1", unit, 0),
          makeTileFromConcept("tile-2", unit, 1),
          ...Array.from({ length: 14 }, () => null),
        ],
        score: 0,
        combo: 0,
        bestCombo: 0,
        turns: 0,
        nextTileId: 3,
        pendingQuizzes: [],
        pendingSpawnCount: 0,
        remainingSeconds: 300,
        elapsedSeconds: 0,
        paused: false,
        startedAt: "2026-06-28T00:00:00.000Z",
        correctAnswers: 0,
        wrongAnswers: 0,
        learnedConceptIds: [],
        weakConceptIds: [],
      },
    });

    useAppStore.getState().move("left");
    const pendingQuiz = useAppStore.getState().currentGame?.pendingQuizzes[0];
    assert.ok(pendingQuiz);
    const quiz = getQuizById(unit, pendingQuiz.quizId);
    assert.ok(quiz);

    useAppStore.getState().submitQuiz(getCorrectResponse(quiz));

    const state = useAppStore.getState();
    assert.equal(state.currentGame?.correctAnswers, 1);
    assert.equal(state.currentGame?.combo, 1);
    assert.ok((state.currentGame?.score ?? 0) > 0);
    assert.ok((state.masteryByConceptId[leftConcept.id] ?? 0) > 50);
    assert.ok((state.masteryByConceptId[rightConcept.id] ?? 0) > 50);
  });
});

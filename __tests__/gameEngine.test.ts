import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyMove,
  canTilesMerge,
  createEmptyBoard,
  evaluateQuizAnswer,
  finalizeResolvedTurn,
  getQuizById,
  hasAvailableMoves,
  resolvePendingQuiz,
} from "../src/engine/gameEngine";
import { getSubjectUnits } from "../src/data/sampleContent";
import { BoardCell, Tile, UnitContent } from "../src/types/models";

function getUnit(subjectId: string): UnitContent {
  const unit = getSubjectUnits(subjectId)[0];
  assert.ok(unit);
  return unit;
}

function makeTileFromConcept(unit: UnitContent, conceptIndex: number, instanceId: string): Tile {
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

describe("gameEngine", () => {
  it("creates an empty board with the expected cell count", () => {
    assert.equal(createEmptyBoard(4).length, 16);
    assert.equal(createEmptyBoard(5).length, 25);
  });

  it("queues multiple quizzes when multiple valid merges happen in one move", () => {
    const unit = getUnit("industrial-safety-engineer");
    const board: BoardCell[] = [
      makeTileFromConcept(unit, 0, "tile-1"),
      makeTileFromConcept(unit, 1, "tile-2"),
      makeTileFromConcept(unit, 3, "tile-3"),
      makeTileFromConcept(unit, 4, "tile-4"),
      ...Array.from({ length: 12 }, () => null),
    ];

    const result = applyMove({
      board,
      unit,
      direction: "left",
      difficulty: "normal",
      boardSize: 4,
      nextTileId: 5,
      rng: () => 0,
    });

    assert.equal(result.moved, true);
    assert.equal(result.pendingQuizzes.length, 2);
    assert.equal(result.board[0]?.stage, 1);
    assert.equal(result.board[1]?.stage, 1);
  });

  it("supports left, right, up, and down movement", () => {
    const unit = getUnit("informatics");
    const tile = makeTileFromConcept(unit, 0, "tile-1");
    const board: BoardCell[] = [
      null, tile, null, null,
      null, null, null, null,
      null, null, null, null,
      null, null, null, null,
    ];

    const left = applyMove({
      board,
      unit,
      direction: "left",
      difficulty: "easy",
      boardSize: 4,
      nextTileId: 2,
      rng: () => 0,
    });
    assert.equal(left.board[0]?.conceptId, tile.conceptId);

    const right = applyMove({
      board,
      unit,
      direction: "right",
      difficulty: "easy",
      boardSize: 4,
      nextTileId: 2,
      rng: () => 0,
    });
    assert.equal(right.board[3]?.conceptId, tile.conceptId);

    const downBoard: BoardCell[] = [
      tile, null, null, null,
      null, null, null, null,
      null, null, null, null,
      null, null, null, null,
    ];
    const down = applyMove({
      board: downBoard,
      unit,
      direction: "down",
      difficulty: "easy",
      boardSize: 4,
      nextTileId: 2,
      rng: () => 0,
    });
    assert.equal(down.board[12]?.conceptId, tile.conceptId);

    const up = applyMove({
      board: downBoard,
      unit,
      direction: "up",
      difficulty: "easy",
      boardSize: 4,
      nextTileId: 2,
      rng: () => 0,
    });
    assert.equal(up.board[0]?.conceptId, tile.conceptId);
  });

  it("merges only related concepts and rejects unrelated or trap-only combinations", () => {
    const unit = getUnit("data-processing-engineer");
    const mergeableLeft = makeTileFromConcept(unit, 0, "a");
    const mergeableRight = makeTileFromConcept(unit, 1, "b");
    const unrelated = makeTileFromConcept(unit, 3, "c");
    const trap = unit.concepts.find((concept) => concept.isTrap);

    assert.equal(canTilesMerge(unit, mergeableLeft, mergeableRight), true);
    assert.equal(canTilesMerge(unit, mergeableLeft, unrelated), false);
    if (trap) {
      const trapTile: Tile = {
        instanceId: "trap",
        conceptId: trap.id,
        title: trap.title,
        blockType: trap.blockType,
        mergeGroupId: trap.mergeGroupId,
        stage: trap.stage,
        isTrap: true,
      };
      assert.equal(canTilesMerge(unit, mergeableLeft, trapTile), false);
    }
  });

  it("validates merge quizzes and keeps the merged board after quiz resolution", () => {
    const unit = getUnit("korean-history");
    const board: BoardCell[] = [
      makeTileFromConcept(unit, 0, "tile-1"),
      makeTileFromConcept(unit, 1, "tile-2"),
      ...Array.from({ length: 14 }, () => null),
    ];

    const moveResult = applyMove({
      board,
      unit,
      direction: "left",
      difficulty: "easy",
      boardSize: 4,
      nextTileId: 3,
      rng: () => 0,
    });

    const pendingQuiz = moveResult.pendingQuizzes[0];
    assert.ok(pendingQuiz);
    const quiz = getQuizById(unit, pendingQuiz.quizId);
    assert.ok(quiz);

    if (quiz.type === "multipleChoice") {
      assert.equal(evaluateQuizAnswer(quiz, quiz.correctOptionId), true);
    } else {
      assert.equal(evaluateQuizAnswer(quiz, true), quiz.type === "ox");
    }

    const resolved = resolvePendingQuiz({
      pendingQuiz,
      unit,
      isCorrect: true,
    });

    assert.equal(resolved.board[0]?.conceptId, pendingQuiz.mergedConceptId);

    const finalized = finalizeResolvedTurn({
      board: resolved.board,
      unit,
      difficulty: "easy",
      boardSize: 4,
      nextTileId: moveResult.nextTileId,
      spawnCount: moveResult.queuedSpawnCount,
      rng: () => 0,
    });

    assert.ok(finalized.board.some((cell) => cell?.conceptId === pendingQuiz.mergedConceptId));
  });

  it("uses a generic result quiz for same-group fallback merges", () => {
    const unit = getUnit("korean-history");
    const board: BoardCell[] = [
      makeTileFromConcept(unit, 3, "tile-1"),
      makeTileFromConcept(unit, 3, "tile-2"),
      ...Array.from({ length: 14 }, () => null),
    ];

    const moveResult = applyMove({
      board,
      unit,
      direction: "left",
      difficulty: "easy",
      boardSize: 4,
      nextTileId: 3,
      rng: () => 0,
    });

    const pendingQuiz = moveResult.pendingQuizzes[0];
    assert.ok(pendingQuiz);
    assert.equal(pendingQuiz.mergeReason, "group");

    const mergedConcept = unit.concepts.find(
      (concept) => concept.id === pendingQuiz.mergedConceptId,
    );
    assert.ok(mergedConcept);
    assert.equal(pendingQuiz.quizId, mergedConcept.practiceQuiz.id);
    assert.ok(getQuizById(unit, pendingQuiz.quizId));
  });

  it("detects a locked board with no empty cells and no valid merges", () => {
    const unit = getUnit("office-automation-industrial-engineer");
    const lockedBoard: BoardCell[] = [
      makeTileFromConcept(unit, 0, "a"),
      makeTileFromConcept(unit, 2, "b"),
      makeTileFromConcept(unit, 4, "c"),
      makeTileFromConcept(unit, 6, "d"),
    ];

    assert.equal(hasAvailableMoves(lockedBoard, unit, 2), false);
  });

  it("keeps tile instance ids unique after movement and merge resolution", () => {
    const unit = getUnit("industrial-safety-engineer");
    const board: BoardCell[] = [
      makeTileFromConcept(unit, 0, "tile-1"),
      makeTileFromConcept(unit, 1, "tile-2"),
      null,
      null,
      ...Array.from({ length: 12 }, () => null),
    ];

    const result = applyMove({
      board,
      unit,
      direction: "left",
      difficulty: "easy",
      boardSize: 4,
      nextTileId: 3,
      rng: () => 0,
    });

    const ids = result.board
      .filter((cell): cell is Tile => Boolean(cell))
      .map((cell) => cell.instanceId);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(result.board.length, 16);
  });

  it("keeps 5x5 board invariants under deterministic movement", () => {
    const unit = getUnit("informatics");
    const board = createEmptyBoard(5);
    board[4] = makeTileFromConcept(unit, 0, "tile-1");
    board[8] = makeTileFromConcept(unit, 2, "tile-2");
    board[20] = makeTileFromConcept(unit, 4, "tile-3");

    const result = applyMove({
      board,
      unit,
      direction: "left",
      difficulty: "hard",
      boardSize: 5,
      nextTileId: 4,
      rng: () => 0,
    });

    assert.equal(result.board.length, 25);
    const ids = result.board
      .filter((cell): cell is Tile => Boolean(cell))
      .map((cell) => cell.instanceId);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.length >= 3);
  });

  it("validates OX, multiple-choice, fill-blank, and matching answers correctly", () => {
    assert.equal(
      evaluateQuizAnswer(
        {
          id: "ox-1",
          type: "ox",
          prompt: "OX",
          correctAnswer: true,
          explanation: "설명",
        },
        true,
      ),
      true,
    );

    assert.equal(
      evaluateQuizAnswer(
        {
          id: "mc-1",
          type: "multipleChoice",
          prompt: "객관식",
          correctOptionId: "a",
          options: [
            { id: "a", text: "정답" },
            { id: "b", text: "오답" },
          ],
          explanation: "설명",
        },
        "a",
      ),
      true,
    );

    assert.equal(
      evaluateQuizAnswer(
        {
          id: "blank-1",
          type: "fillBlank",
          prompt: "빈칸",
          placeholder: "입력",
          acceptableAnswers: ["정답"],
          explanation: "설명",
        },
        " 정답 ",
      ),
      true,
    );

    assert.equal(
      evaluateQuizAnswer(
        {
          id: "match-1",
          type: "matching",
          prompt: "짝맞추기",
          pairs: [
            { left: "A", right: "1" },
            { left: "B", right: "2" },
          ],
          choices: ["1", "2", "3"],
          explanation: "설명",
        },
        { A: "1", B: "2" },
      ),
      true,
    );
  });
});

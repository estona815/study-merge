import {
  BoardCell,
  ConceptDefinition,
  Difficulty,
  Direction,
  PendingQuiz,
  Quiz,
  QuizResponse,
  Tile,
  UnitContent,
} from "../types/models";

export interface SpawnResult {
  board: BoardCell[];
  nextTileId: number;
  spawnedConceptIds: string[];
}

export interface MoveResult {
  board: BoardCell[];
  moved: boolean;
  nextTileId: number;
  pendingQuizzes: PendingQuiz[];
  queuedSpawnCount: number;
  gameOver: boolean;
}

export interface ResolveQuizResult {
  board: BoardCell[];
  isCorrect: boolean;
  scoreDelta: number;
  resolvedConceptId: string;
  sourceConceptIds: [string, string];
}

function cloneBoard(board: BoardCell[]): BoardCell[] {
  return board.map((cell) => (cell ? { ...cell } : null));
}

function recipeKey(leftConceptId: string, rightConceptId: string): string {
  return [leftConceptId, rightConceptId].sort().join("::");
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function getConceptMap(unit: UnitContent): Map<string, ConceptDefinition> {
  return new Map(unit.concepts.map((concept) => [concept.id, concept]));
}

function getQuizMap(unit: UnitContent): Map<string, Quiz> {
  return new Map([
    ...unit.quizzes.map((quiz) => [quiz.id, quiz] as const),
    ...unit.concepts.map((concept) => [concept.practiceQuiz.id, concept.practiceQuiz] as const),
  ]);
}

function getRecipeMap(unit: UnitContent) {
  return new Map(
    unit.recipes.map((recipe) => [
      recipeKey(recipe.sourceConceptIds[0], recipe.sourceConceptIds[1]),
      recipe,
    ]),
  );
}

function createTile(concept: ConceptDefinition, nextTileId: number): Tile {
  return {
    instanceId: `tile-${nextTileId}`,
    conceptId: concept.id,
    title: concept.title,
    blockType: concept.blockType,
    mergeGroupId: concept.mergeGroupId,
    stage: concept.stage,
    isTrap: concept.isTrap,
  };
}

function getSpawnableConcepts(unit: UnitContent, difficulty: Difficulty): ConceptDefinition[] {
  return unit.concepts.filter((concept) => {
    if (!concept.isSpawnable) {
      return false;
    }

    if (concept.isTrap) {
      return difficulty === "hard" || difficulty === "exam";
    }

    return true;
  });
}

function pickWeightedConcept(
  concepts: ConceptDefinition[],
  rng: () => number,
): ConceptDefinition | undefined {
  if (!concepts.length) {
    return undefined;
  }

  const totalWeight = concepts.reduce(
    (sum, concept) => sum + (concept.spawnWeight ?? 1),
    0,
  );
  let cursor = rng() * totalWeight;

  for (const concept of concepts) {
    cursor -= concept.spawnWeight ?? 1;
    if (cursor <= 0) {
      return concept;
    }
  }

  return concepts.at(-1);
}

function pickSpawnCount(difficulty: Difficulty, rng: () => number): number {
  if (difficulty === "easy") {
    return 1;
  }

  if (difficulty === "hard") {
    return rng() < 0.55 ? 2 : 1;
  }

  if (difficulty === "exam") {
    return rng() < 0.5 ? 2 : 1;
  }

  return rng() < 0.35 ? 2 : 1;
}

function boardEquals(left: BoardCell[], right: BoardCell[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftCell = left[index];
    const rightCell = right[index];

    if (!leftCell && !rightCell) {
      continue;
    }

    if (!leftCell || !rightCell) {
      return false;
    }

    if (leftCell.instanceId !== rightCell.instanceId) {
      return false;
    }
  }

  return true;
}

function buildLineIndexes(
  boardSize: number,
  direction: Direction,
  lineIndex: number,
): number[] {
  const indexes: number[] = [];

  for (let offset = 0; offset < boardSize; offset += 1) {
    if (direction === "left") {
      indexes.push(lineIndex * boardSize + offset);
    } else if (direction === "right") {
      indexes.push(lineIndex * boardSize + (boardSize - 1 - offset));
    } else if (direction === "up") {
      indexes.push(offset * boardSize + lineIndex);
    } else {
      indexes.push((boardSize - 1 - offset) * boardSize + lineIndex);
    }
  }

  return indexes;
}

function areRelated(
  leftConcept: ConceptDefinition,
  rightConcept: ConceptDefinition,
): boolean {
  return (
    leftConcept.relatedConceptIds.includes(rightConcept.id) ||
    rightConcept.relatedConceptIds.includes(leftConcept.id)
  );
}

function getNextStageConcept(
  unit: UnitContent,
  mergeGroupId: string,
  currentStage: number,
): ConceptDefinition | undefined {
  return unit.concepts.find(
    (concept) =>
      concept.mergeGroupId === mergeGroupId && concept.stage === currentStage + 1,
  );
}

function createMergedConceptResult(
  unit: UnitContent,
  leftTile: Tile,
  rightTile: Tile,
): {
  resultConcept: ConceptDefinition;
  quizId: string;
  recipeId?: string;
  mergeReason: PendingQuiz["mergeReason"];
} | null {
  const conceptMap = getConceptMap(unit);
  const recipe = getRecipeMap(unit).get(recipeKey(leftTile.conceptId, rightTile.conceptId));
  if (recipe) {
    const resultConcept = conceptMap.get(recipe.resultConceptId);
    if (!resultConcept) {
      return null;
    }

    return {
      resultConcept,
      quizId: recipe.quizId,
      recipeId: recipe.id,
      mergeReason: "recipe",
    };
  }

  const leftConcept = conceptMap.get(leftTile.conceptId);
  const rightConcept = conceptMap.get(rightTile.conceptId);
  if (!leftConcept || !rightConcept) {
    return null;
  }

  if (leftTile.stage !== rightTile.stage) {
    return null;
  }

  if (leftTile.mergeGroupId !== rightTile.mergeGroupId && !areRelated(leftConcept, rightConcept)) {
    return null;
  }

  const resultConcept = getNextStageConcept(
    unit,
    leftTile.mergeGroupId === rightTile.mergeGroupId
      ? leftTile.mergeGroupId
      : rightConcept.mergeGroupId,
    leftTile.stage,
  );

  if (!resultConcept) {
    return null;
  }

  const fallbackRecipe = unit.recipes.find(
    (item) => item.resultConceptId === resultConcept.id,
  );

  return {
    resultConcept,
    quizId: resultConcept.practiceQuiz.id,
    recipeId: fallbackRecipe?.id,
    mergeReason: leftTile.mergeGroupId === rightTile.mergeGroupId ? "group" : "related",
  };
}

export function createEmptyBoard(boardSize: number): BoardCell[] {
  return Array.from({ length: boardSize * boardSize }, () => null);
}

export function spawnTiles(params: {
  board: BoardCell[];
  unit: UnitContent;
  difficulty: Difficulty;
  nextTileId: number;
  count: number;
  rng?: () => number;
}): SpawnResult {
  const rng = params.rng ?? Math.random;
  const board = cloneBoard(params.board);
  const emptyIndexes = board
    .map((cell, index) => (cell ? -1 : index))
    .filter((index) => index >= 0);
  const spawnableConcepts = getSpawnableConcepts(params.unit, params.difficulty);
  const spawnedConceptIds: string[] = [];
  let nextTileId = params.nextTileId;

  for (
    let spawnIndex = 0;
    spawnIndex < params.count && emptyIndexes.length > 0;
    spawnIndex += 1
  ) {
    const targetIndex = Math.floor(rng() * emptyIndexes.length);
    const boardIndex = emptyIndexes.splice(targetIndex, 1)[0];
    const concept = pickWeightedConcept(spawnableConcepts, rng);
    if (boardIndex === undefined || !concept) {
      continue;
    }

    board[boardIndex] = createTile(concept, nextTileId);
    spawnedConceptIds.push(concept.id);
    nextTileId += 1;
  }

  return {
    board,
    nextTileId,
    spawnedConceptIds,
  };
}

export function canTilesMerge(
  unit: UnitContent,
  leftTile: Tile | null,
  rightTile: Tile | null,
): boolean {
  if (!leftTile || !rightTile) {
    return false;
  }

  return Boolean(createMergedConceptResult(unit, leftTile, rightTile));
}

export function findHintPairs(
  board: BoardCell[],
  unit: UnitContent,
  boardSize: number,
): string[] {
  const hints = new Set<string>();

  for (let row = 0; row < boardSize; row += 1) {
    for (let column = 0; column < boardSize; column += 1) {
      const currentIndex = row * boardSize + column;
      const currentTile = board[currentIndex];
      if (!currentTile) {
        continue;
      }

      const rightIndex = column < boardSize - 1 ? currentIndex + 1 : -1;
      const downIndex = row < boardSize - 1 ? currentIndex + boardSize : -1;
      const rightTile = rightIndex >= 0 ? board[rightIndex] ?? null : null;
      const downTile = downIndex >= 0 ? board[downIndex] ?? null : null;

      if (canTilesMerge(unit, currentTile, rightTile)) {
        hints.add(`${currentTile.title} + ${rightTile?.title}`);
      }

      if (canTilesMerge(unit, currentTile, downTile)) {
        hints.add(`${currentTile.title} + ${downTile?.title}`);
      }
    }
  }

  return [...hints];
}

export function hasAvailableMoves(
  board: BoardCell[],
  unit: UnitContent,
  boardSize: number,
): boolean {
  if (board.some((cell) => cell === null)) {
    return true;
  }

  for (let row = 0; row < boardSize; row += 1) {
    for (let column = 0; column < boardSize; column += 1) {
      const index = row * boardSize + column;
      const currentTile = board[index];

      if (!currentTile) {
        continue;
      }

      const rightTile = column < boardSize - 1 ? board[index + 1] ?? null : null;
      const downTile =
        row < boardSize - 1 ? board[index + boardSize] ?? null : null;

      if (canTilesMerge(unit, currentTile, rightTile)) {
        return true;
      }

      if (canTilesMerge(unit, currentTile, downTile)) {
        return true;
      }
    }
  }

  return false;
}

export function applyMove(params: {
  board: BoardCell[];
  unit: UnitContent;
  direction: Direction;
  difficulty: Difficulty;
  boardSize: number;
  nextTileId: number;
  rng?: () => number;
}): MoveResult {
  const workingBoard = cloneBoard(params.board);
  const originalBoard = cloneBoard(params.board);
  let nextTileId = params.nextTileId;
  const mergeEvents: PendingQuiz[] = [];

  for (let line = 0; line < params.boardSize; line += 1) {
    const indexes = buildLineIndexes(params.boardSize, params.direction, line);
    const tiles = indexes
      .map((index) => workingBoard[index])
      .filter((tile): tile is Tile => Boolean(tile));
    const nextLine: BoardCell[] = [];

    for (let index = 0; index < tiles.length; index += 1) {
      const currentTile = tiles[index];
      if (!currentTile) {
        continue;
      }

      const nextTile = tiles[index + 1];
      const mergeResult =
        nextTile ? createMergedConceptResult(params.unit, currentTile, nextTile) : null;

      if (mergeResult && nextTile) {
        const mergedTile = createTile(mergeResult.resultConcept, nextTileId);
        nextTileId += 1;
        nextLine.push(mergedTile);
        mergeEvents.push({
          recipeId: mergeResult.recipeId,
          quizId: mergeResult.quizId,
          mergedConceptId: mergeResult.resultConcept.id,
          mergedTileId: mergedTile.instanceId,
          sourceConceptIds: [currentTile.conceptId, nextTile.conceptId],
          previewBoard: [],
          mergeReason: mergeResult.mergeReason,
        });
        index += 1;
        continue;
      }

      nextLine.push(currentTile);
    }

    while (nextLine.length < params.boardSize) {
      nextLine.push(null);
    }

    indexes.forEach((boardIndex, position) => {
      workingBoard[boardIndex] = nextLine[position] ?? null;
    });
  }

  const moved = !boardEquals(workingBoard, originalBoard);
  if (!moved) {
    return {
      board: params.board,
      moved: false,
      nextTileId: params.nextTileId,
      pendingQuizzes: [],
      queuedSpawnCount: 0,
      gameOver: false,
    };
  }

  if (mergeEvents.length > 0) {
    const previewBoard = cloneBoard(workingBoard);
    const pendingQuizzes = mergeEvents.map((event) => ({
      ...event,
      previewBoard,
    }));

    return {
      board: workingBoard,
      moved: true,
      nextTileId,
      pendingQuizzes,
      queuedSpawnCount: pickSpawnCount(params.difficulty, params.rng ?? Math.random),
      gameOver: false,
    };
  }

  const spawnResult = spawnTiles({
    board: workingBoard,
    unit: params.unit,
    difficulty: params.difficulty,
    nextTileId,
    count: pickSpawnCount(params.difficulty, params.rng ?? Math.random),
    rng: params.rng,
  });

  return {
    board: spawnResult.board,
    moved: true,
    nextTileId: spawnResult.nextTileId,
    pendingQuizzes: [],
    queuedSpawnCount: 0,
    gameOver: !hasAvailableMoves(spawnResult.board, params.unit, params.boardSize),
  };
}

export function evaluateQuizAnswer(
  quiz: Quiz,
  response: QuizResponse,
): boolean {
  switch (quiz.type) {
    case "ox":
      return typeof response === "boolean" && response === quiz.correctAnswer;
    case "multipleChoice":
      return typeof response === "string" && response === quiz.correctOptionId;
    case "fillBlank":
      return (
        typeof response === "string" &&
        quiz.acceptableAnswers.some(
          (answer) => normalizeAnswer(answer) === normalizeAnswer(response),
        )
      );
    case "matching":
      if (typeof response !== "object" || response === null || Array.isArray(response)) {
        return false;
      }

      return quiz.pairs.every((pair) => response[pair.left] === pair.right);
    default:
      return false;
  }
}

export function resolvePendingQuiz(params: {
  pendingQuiz: PendingQuiz;
  unit: UnitContent;
  isCorrect: boolean;
}): ResolveQuizResult {
  const conceptMap = getConceptMap(params.unit);
  const resolvedConcept = conceptMap.get(params.pendingQuiz.mergedConceptId);
  const conceptDifficulty = resolvedConcept?.difficulty ?? 1;

  return {
    board: cloneBoard(params.pendingQuiz.previewBoard),
    isCorrect: params.isCorrect,
    scoreDelta: params.isCorrect ? conceptDifficulty : 0,
    resolvedConceptId: params.pendingQuiz.mergedConceptId,
    sourceConceptIds: params.pendingQuiz.sourceConceptIds,
  };
}

export function finalizeResolvedTurn(params: {
  board: BoardCell[];
  unit: UnitContent;
  difficulty: Difficulty;
  boardSize: number;
  nextTileId: number;
  spawnCount: number;
  rng?: () => number;
}): SpawnResult & { gameOver: boolean } {
  const spawnResult = spawnTiles({
    board: params.board,
    unit: params.unit,
    difficulty: params.difficulty,
    nextTileId: params.nextTileId,
    count: params.spawnCount,
    rng: params.rng,
  });

  return {
    ...spawnResult,
    gameOver: !hasAvailableMoves(spawnResult.board, params.unit, params.boardSize),
  };
}

export function getQuizById(unit: UnitContent, quizId: string): Quiz | undefined {
  return getQuizMap(unit).get(quizId);
}

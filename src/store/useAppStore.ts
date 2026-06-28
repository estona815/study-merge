import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getSubjectById } from "../data/subjectCatalog";
import { getConceptById, getUnitContent } from "../data/sampleContent";
import {
  applyMove,
  createEmptyBoard,
  evaluateQuizAnswer,
  finalizeResolvedTurn,
  resolvePendingQuiz,
  spawnTiles,
} from "../engine/gameEngine";
import { calculateMergeScore, calculateUnitClearBonus } from "../engine/scoring";
import {
  calculateReviewPriority,
  getNextReviewAt,
  getReviewLabel,
} from "../engine/spacedRepetition";
import {
  buildPersistedAppStoreState,
  PersistedAppStoreState,
  restorePersistedAppStoreState,
} from "./appStorePersistence";
import {
  CategoryPreset,
  Difficulty,
  Direction,
  GameSession,
  LearningGoal,
  ReviewItem,
  ScreenName,
  SessionHistoryEntry,
  SessionResult,
  SubjectFilter,
  SubjectProgressSnapshot,
  TrackType,
} from "../types/models";

type CompletionReason = SessionResult["reason"];

export interface AppStoreState {
  activeScreen: ScreenName;
  onboardingComplete: boolean;
  selectedMode: TrackType;
  focusPreset: CategoryPreset;
  selectedSubjectId?: string;
  selectedUnitId?: string;
  subjectSearch: string;
  subjectFilter: SubjectFilter;
  difficulty: Difficulty;
  goal: LearningGoal;
  masteryByConceptId: Record<string, number>;
  subjectProgress: Record<string, SubjectProgressSnapshot>;
  reviewQueue: ReviewItem[];
  sessionHistory: SessionHistoryEntry[];
  currentGame?: GameSession;
  lastResult?: SessionResult;
  streakDays: number;
  lastStudyDate?: string;
  setMode: (mode: TrackType) => void;
  setGoal: (goal: LearningGoal) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setSubjectFilter: (filter: SubjectFilter) => void;
  finishOnboarding: () => void;
  openCategory: () => void;
  openPreset: (preset: CategoryPreset) => void;
  goToSubjects: (mode?: TrackType) => void;
  openReview: () => void;
  openStats: () => void;
  setSubjectSearch: (value: string) => void;
  selectSubject: (subjectId: string) => void;
  selectUnit: (unitId: string) => void;
  startGame: (
    unitId?: string,
    presetOverride?: CategoryPreset,
    difficultyOverride?: Difficulty,
  ) => void;
  move: (direction: Direction) => void;
  submitQuiz: (response: boolean | string | Record<string, string>) => void;
  tickGameTimer: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  finishGame: (reason?: CompletionReason) => void;
  clearReviewItem: (reviewId: string) => void;
  startReviewItem: (reviewId: string) => void;
  restartLastUnit: () => void;
}

function clampMastery(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function sortReviewQueue(queue: ReviewItem[]): ReviewItem[] {
  return [...queue].sort((left, right) => right.reviewPriority - left.reviewPriority);
}

function getBoardSize(difficulty: Difficulty): number {
  return difficulty === "hard" ? 5 : 4;
}

function getSessionDuration(
  preset: CategoryPreset,
  goal: LearningGoal,
  difficulty: Difficulty,
): number {
  if (preset === "quick") {
    return 180;
  }

  if (preset === "examCram" || difficulty === "exam" || goal === "exam") {
    return 150;
  }

  if (goal === "mastery") {
    return 420;
  }

  return 300;
}

function getDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function diffInDays(currentDayKey: string, lastDayKey?: string): number {
  if (!lastDayKey) {
    return 99;
  }

  const currentTime = new Date(`${currentDayKey}T00:00:00.000Z`).getTime();
  const lastTime = new Date(`${lastDayKey}T00:00:00.000Z`).getTime();
  return Math.round((currentTime - lastTime) / 86400000);
}

function nextStreak(currentDayKey: string, lastDayKey: string | undefined, streak: number) {
  const dayDiff = diffInDays(currentDayKey, lastDayKey);

  if (!lastDayKey) {
    return 1;
  }

  if (dayDiff === 0) {
    return streak || 1;
  }

  if (dayDiff === 1) {
    return streak + 1;
  }

  return 1;
}

function buildReviewItem(params: {
  subjectId: string;
  unitId: string;
  conceptId: string;
  prompt: string;
  explanation: string;
  sourceConceptIds: [string, string];
  existing?: ReviewItem;
  mastery: number;
  examImportance: number;
}): ReviewItem {
  const sourceTitles = params.sourceConceptIds
    .map((conceptId) => getConceptById(conceptId)?.title ?? conceptId)
    .slice(0, 2);
  const incorrectCount = (params.existing?.incorrectCount ?? 0) + 1;
  const lastReviewedAt = new Date().toISOString();
  const reviewPriority = calculateReviewPriority({
    wrongCount: incorrectCount,
    mastery: params.mastery,
    examImportance: params.examImportance,
    lastReviewedAt: params.existing?.lastReviewedAt,
  });

  return {
    id: params.existing?.id ?? `review-${params.unitId}-${params.conceptId}`,
    subjectId: params.subjectId,
    unitId: params.unitId,
    conceptId: params.conceptId,
    prompt: params.prompt,
    explanation: params.explanation,
    sourceTitles,
    incorrectCount,
    mastery: params.mastery,
    reviewPriority,
    nextReviewLabel: getReviewLabel(reviewPriority, incorrectCount),
    createdAt: params.existing?.createdAt ?? lastReviewedAt,
    lastReviewedAt,
    nextReviewAt: getNextReviewAt(reviewPriority),
  };
}

function completeSessionState(
  state: AppStoreState,
  game: GameSession,
  reason: CompletionReason,
): Partial<AppStoreState> {
  const subject = getSubjectById(game.subjectId);
  const unit = getUnitContent(game.unitId);
  if (!subject || !unit) {
    return {
      currentGame: undefined,
      activeScreen: "category",
    };
  }

  const completedAt = new Date().toISOString();
  const dayKey = getDayKey(new Date(completedAt));
  const weakConceptIds = unique(game.weakConceptIds).slice(0, 5);
  const finalScore =
    reason === "clear"
      ? game.score + calculateUnitClearBonus(game.wrongAnswers)
      : game.score;
  const historyEntry: SessionHistoryEntry = {
    id: `session-${completedAt}`,
    subjectId: game.subjectId,
    unitId: game.unitId,
    focusPreset: game.focusPreset,
    difficulty: game.difficulty,
    score: finalScore,
    correctAnswers: game.correctAnswers,
    wrongAnswers: game.wrongAnswers,
    durationSeconds: game.elapsedSeconds,
    completedAt,
  };
  const sessionHistory = [historyEntry, ...state.sessionHistory].slice(0, 40);
  const masteryAverage =
    unit.concepts.reduce(
      (sum, concept) => sum + (state.masteryByConceptId[concept.id] ?? 50),
      0,
    ) / unit.concepts.length;
  const previousProgress = state.subjectProgress[game.subjectId] ?? {
    subjectId: game.subjectId,
    sessions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    studySeconds: 0,
    masteryByUnit: {},
  };
  const subjectProgress: Record<string, SubjectProgressSnapshot> = {
    ...state.subjectProgress,
    [game.subjectId]: {
      ...previousProgress,
      sessions: previousProgress.sessions + 1,
      correctAnswers: previousProgress.correctAnswers + game.correctAnswers,
      wrongAnswers: previousProgress.wrongAnswers + game.wrongAnswers,
      studySeconds: previousProgress.studySeconds + game.elapsedSeconds,
      masteryByUnit: {
        ...previousProgress.masteryByUnit,
        [game.unitId]: Math.round(masteryAverage),
      },
      lastPlayedAt: completedAt,
    },
  };
  const result: SessionResult = {
    subjectId: game.subjectId,
    subjectName: subject.name,
    unitId: game.unitId,
    unitTitle: unit.title,
    focusPreset: game.focusPreset,
    difficulty: game.difficulty,
    score: finalScore,
    correctAnswers: game.correctAnswers,
    wrongAnswers: game.wrongAnswers,
    bestCombo: game.bestCombo,
    studiedConceptCount: unique(game.learnedConceptIds).length,
    weakConceptIds,
    recommendedNextStep:
      reason === "quit"
        ? "중단한 단원은 같은 난이도로 바로 다시 시작할 수 있습니다. 3분만 더 이어서 흐름을 살려 보세요."
        : reason === "time"
          ? "제한 시간이 끝났습니다. 같은 단원을 다시 시작하거나 쉬움 난이도로 개념 연결부터 익혀 보세요."
          : weakConceptIds.length > 0
            ? "복습 큐의 상단 개념부터 다시 보고, 같은 단원을 쉬움 난이도로 한 번 더 플레이해 보세요."
            : "같은 계열의 다른 과목이나 3분 게임 모드로 이어가 보세요.",
    durationSeconds: game.elapsedSeconds,
    reason,
    completedAt,
  };

  return {
    currentGame: undefined,
    activeScreen: "result",
    lastResult: result,
    subjectProgress,
    sessionHistory,
    streakDays: nextStreak(dayKey, state.lastStudyDate, state.streakDays),
    lastStudyDate: dayKey,
  };
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
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
      setMode: (mode) => {
        set({
          selectedMode: mode,
          subjectFilter: "all",
        });
      },
      setGoal: (goal) => {
        set({ goal });
      },
      setDifficulty: (difficulty) => {
        set({ difficulty });
      },
      setSubjectFilter: (filter) => {
        set({ subjectFilter: filter });
      },
      finishOnboarding: () => {
        set((state) => ({
          onboardingComplete: true,
          activeScreen: "category",
          focusPreset: state.selectedMode,
        }));
      },
      openCategory: () => {
        set({
          activeScreen: "category",
          currentGame: undefined,
          subjectSearch: "",
          subjectFilter: "all",
        });
      },
      openPreset: (preset) => {
        if (preset === "todayReview" || preset === "wrongAnswers") {
          set({
            focusPreset: preset,
            activeScreen: "review",
          });
          return;
        }

        if (preset === "weakness") {
          set({
            focusPreset: preset,
            activeScreen: "stats",
          });
          return;
        }

        if (preset === "highSchool" || preset === "certification") {
          set({
            focusPreset: preset,
            selectedMode: preset,
            activeScreen: "subject",
            subjectSearch: "",
            subjectFilter: "all",
          });
          return;
        }

        set((state) => ({
          focusPreset: preset,
          selectedMode: state.selectedMode ?? "highSchool",
          difficulty: preset === "examCram" ? "exam" : state.difficulty,
          goal: preset === "examCram" ? "exam" : state.goal,
          activeScreen: "subject",
          subjectSearch: "",
          subjectFilter: "all",
        }));
      },
      goToSubjects: (mode) => {
        set((state) => ({
          activeScreen: "subject",
          selectedMode: mode ?? state.selectedMode,
          subjectSearch: "",
          subjectFilter: "all",
        }));
      },
      openReview: () => {
        set({
          activeScreen: "review",
        });
      },
      openStats: () => {
        set({
          activeScreen: "stats",
        });
      },
      setSubjectSearch: (value) => {
        set({
          subjectSearch: value,
        });
      },
      selectSubject: (subjectId) => {
        set({
          selectedSubjectId: subjectId,
          activeScreen: "unit",
        });
      },
      selectUnit: (unitId) => {
        set({
          selectedUnitId: unitId,
        });
      },
      startGame: (unitId, presetOverride, difficultyOverride) => {
        const state = get();
        const resolvedUnitId = unitId ?? state.selectedUnitId;
        if (!resolvedUnitId) {
          return;
        }

        const unit = getUnitContent(resolvedUnitId);
        if (!unit) {
          return;
        }

        const difficulty = difficultyOverride ?? state.difficulty;
        const boardSize = getBoardSize(difficulty);
        const initialBoard = createEmptyBoard(boardSize);
        const spawnResult = spawnTiles({
          board: initialBoard,
          unit,
          difficulty,
          nextTileId: 1,
          count: 3,
        });

        set({
          activeScreen: "game",
          selectedSubjectId: unit.subjectId,
          selectedUnitId: unit.id,
          currentGame: {
            subjectId: unit.subjectId,
            unitId: unit.id,
            focusPreset: presetOverride ?? state.focusPreset,
            difficulty,
            boardSize,
            board: spawnResult.board,
            score: 0,
            combo: 0,
            bestCombo: 0,
            turns: 0,
            nextTileId: spawnResult.nextTileId,
            pendingQuizzes: [],
            pendingSpawnCount: 0,
            remainingSeconds: getSessionDuration(
              presetOverride ?? state.focusPreset,
              state.goal,
              difficulty,
            ),
            elapsedSeconds: 0,
            paused: false,
            startedAt: new Date().toISOString(),
            correctAnswers: 0,
            wrongAnswers: 0,
            learnedConceptIds: [],
            weakConceptIds: [],
            lastExplanationConceptId: undefined,
          },
        });
      },
      move: (direction) => {
        set((state) => {
          const game = state.currentGame;
          if (!game || game.paused || game.pendingQuizzes.length > 0) {
            return {};
          }

          const unit = getUnitContent(game.unitId);
          if (!unit) {
            return {};
          }

          const moveResult = applyMove({
            board: game.board,
            unit,
            direction,
            difficulty: game.difficulty,
            boardSize: game.boardSize,
            nextTileId: game.nextTileId,
          });

          if (!moveResult.moved) {
            return {};
          }

          const nextGame: GameSession = {
            ...game,
            board: moveResult.board,
            nextTileId: moveResult.nextTileId,
            pendingQuizzes: moveResult.pendingQuizzes,
            pendingSpawnCount: moveResult.queuedSpawnCount,
            turns: game.turns + 1,
          };

          if (moveResult.gameOver) {
            return completeSessionState(
              {
                ...state,
                currentGame: nextGame,
              },
              nextGame,
              "blocked",
            );
          }

          return {
            currentGame: nextGame,
          };
        });
      },
      submitQuiz: (response) => {
        set((state) => {
          const game = state.currentGame;
          if (!game || game.pendingQuizzes.length === 0) {
            return {};
          }

          const unit = getUnitContent(game.unitId);
          if (!unit) {
            return {};
          }

          const activeQuizState = game.pendingQuizzes[0];
          if (!activeQuizState) {
            return {};
          }

          const quiz = unit.quizzes.find((item) => item.id === activeQuizState.quizId);
          if (!quiz) {
            return {};
          }

          const isCorrect = evaluateQuizAnswer(quiz, response);
          const resolved = resolvePendingQuiz({
            pendingQuiz: activeQuizState,
            unit,
            isCorrect,
          });
          const resolvedConcept = getConceptById(resolved.resolvedConceptId);
          const masteryByConceptId = { ...state.masteryByConceptId };

          for (const sourceConceptId of resolved.sourceConceptIds) {
            masteryByConceptId[sourceConceptId] = clampMastery(
              (masteryByConceptId[sourceConceptId] ?? 50) + (isCorrect ? 10 : -5),
            );
          }

          masteryByConceptId[resolved.resolvedConceptId] = clampMastery(
            (masteryByConceptId[resolved.resolvedConceptId] ?? 45) + (isCorrect ? 10 : -5),
          );

          let reviewQueue = state.reviewQueue;
          if (!isCorrect || (masteryByConceptId[resolved.resolvedConceptId] ?? 100) < 40) {
            const existing = reviewQueue.find(
              (item) =>
                item.unitId === game.unitId &&
                item.conceptId === resolved.resolvedConceptId,
            );
            const reviewItem = buildReviewItem({
              subjectId: game.subjectId,
              unitId: game.unitId,
              conceptId: resolved.resolvedConceptId,
              prompt: quiz.prompt,
              explanation: quiz.explanation,
              sourceConceptIds: resolved.sourceConceptIds,
              existing,
              mastery: masteryByConceptId[resolved.resolvedConceptId] ?? 50,
              examImportance: unit.examImportance,
            });
            reviewQueue = sortReviewQueue([
              reviewItem,
              ...reviewQueue.filter((item) => item.id !== reviewItem.id),
            ]);
          }

          const nextCombo = isCorrect ? game.combo + 1 : 0;
          const scoreDelta = calculateMergeScore({
            combo: nextCombo,
            conceptDifficulty: resolvedConcept?.difficulty ?? 1,
            isCorrect,
            isTrap: resolvedConcept?.isTrap,
          });

          const remainingQuizzes = game.pendingQuizzes.slice(1);
          let nextBoard = resolved.board;
          let nextTileId = game.nextTileId;
          let pendingSpawnCount = game.pendingSpawnCount;
          let gameOver = false;

          if (remainingQuizzes.length === 0 && game.pendingSpawnCount > 0) {
            const finalizedTurn = finalizeResolvedTurn({
              board: resolved.board,
              unit,
              difficulty: game.difficulty,
              boardSize: game.boardSize,
              nextTileId: game.nextTileId,
              spawnCount: game.pendingSpawnCount,
            });
            nextBoard = finalizedTurn.board;
            nextTileId = finalizedTurn.nextTileId;
            pendingSpawnCount = 0;
            gameOver = finalizedTurn.gameOver;
          }

          const nextGame: GameSession = {
            ...game,
            board: nextBoard,
            nextTileId,
            pendingQuizzes: remainingQuizzes,
            pendingSpawnCount,
            score: game.score + scoreDelta,
            combo: nextCombo,
            bestCombo: Math.max(game.bestCombo, nextCombo),
            correctAnswers: game.correctAnswers + (isCorrect ? 1 : 0),
            wrongAnswers: game.wrongAnswers + (isCorrect ? 0 : 1),
            learnedConceptIds: isCorrect
              ? unique([...game.learnedConceptIds, resolved.resolvedConceptId])
              : game.learnedConceptIds,
            weakConceptIds:
              !isCorrect || (masteryByConceptId[resolved.resolvedConceptId] ?? 100) < 40
                ? unique([...game.weakConceptIds, ...resolved.sourceConceptIds, resolved.resolvedConceptId])
                : game.weakConceptIds,
            lastExplanationConceptId: resolved.resolvedConceptId,
          };

          if (gameOver) {
            return {
              masteryByConceptId,
              reviewQueue,
              ...completeSessionState(
                {
                  ...state,
                  masteryByConceptId,
                  reviewQueue,
                  currentGame: nextGame,
                },
                nextGame,
                "blocked",
              ),
            };
          }

          return {
            masteryByConceptId,
            reviewQueue,
            currentGame: nextGame,
          };
        });
      },
      tickGameTimer: () => {
        set((state) => {
          const game = state.currentGame;
          if (!game || game.paused || game.pendingQuizzes.length > 0) {
            return {};
          }

          const remainingSeconds = Math.max(game.remainingSeconds - 1, 0);
          const nextGame: GameSession = {
            ...game,
            remainingSeconds,
            elapsedSeconds: game.elapsedSeconds + 1,
          };

          if (remainingSeconds === 0) {
            return completeSessionState(
              {
                ...state,
                currentGame: nextGame,
              },
              nextGame,
              "time",
            );
          }

          return {
            currentGame: nextGame,
          };
        });
      },
      pauseGame: () => {
        set((state) => ({
          currentGame: state.currentGame
            ? {
                ...state.currentGame,
                paused: true,
              }
            : undefined,
        }));
      },
      resumeGame: () => {
        set((state) => ({
          currentGame: state.currentGame
            ? {
                ...state.currentGame,
                paused: false,
              }
            : undefined,
        }));
      },
      finishGame: (reason = "quit") => {
        set((state) => {
          const game = state.currentGame;
          if (!game) {
            return {};
          }

          return completeSessionState(state, game, reason);
        });
      },
      clearReviewItem: (reviewId) => {
        set((state) => ({
          reviewQueue: state.reviewQueue.filter((item) => item.id !== reviewId),
        }));
      },
      startReviewItem: (reviewId) => {
        const reviewItem = get().reviewQueue.find((item) => item.id === reviewId);
        if (!reviewItem) {
          return;
        }

        const subject = getSubjectById(reviewItem.subjectId);
        set({
          selectedMode: subject?.mode ?? "highSchool",
          selectedSubjectId: reviewItem.subjectId,
          selectedUnitId: reviewItem.unitId,
          focusPreset: "todayReview",
          difficulty: "easy",
        });
        get().startGame(reviewItem.unitId, "todayReview", "easy");
      },
      restartLastUnit: () => {
        const lastResult = get().lastResult;
        if (!lastResult) {
          return;
        }

        get().startGame(
          lastResult.unitId,
          lastResult.focusPreset,
          lastResult.difficulty,
        );
      },
    }),
    {
      name: "study-merge-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        buildPersistedAppStoreState({
          onboardingComplete: state.onboardingComplete,
          selectedMode: state.selectedMode,
          focusPreset: state.focusPreset,
          selectedSubjectId: state.selectedSubjectId,
          selectedUnitId: state.selectedUnitId,
          subjectSearch: state.subjectSearch,
          subjectFilter: state.subjectFilter,
          difficulty: state.difficulty,
          goal: state.goal,
          masteryByConceptId: state.masteryByConceptId,
          subjectProgress: state.subjectProgress,
          reviewQueue: state.reviewQueue,
          sessionHistory: state.sessionHistory,
          currentGame: state.currentGame,
          lastResult: state.lastResult,
          streakDays: state.streakDays,
          lastStudyDate: state.lastStudyDate,
        }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...restorePersistedAppStoreState(
          persistedState as Partial<PersistedAppStoreState> | undefined,
        ),
      }),
    },
  ),
);

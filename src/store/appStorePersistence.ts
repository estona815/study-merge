import {
  CategoryPreset,
  Difficulty,
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

export interface PersistedAppStoreState {
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
}

export interface RestoredAppStoreState extends PersistedAppStoreState {
  activeScreen: ScreenName;
}

function cloneGameSession(game?: GameSession): GameSession | undefined {
  if (!game) {
    return undefined;
  }

  return {
    ...game,
    board: game.board.map((cell) => (cell ? { ...cell } : null)),
    pendingQuizzes: game.pendingQuizzes.map((quiz) => ({
      ...quiz,
      sourceConceptIds: [...quiz.sourceConceptIds] as [string, string],
      previewBoard: quiz.previewBoard.map((cell) => (cell ? { ...cell } : null)),
    })),
    learnedConceptIds: [...game.learnedConceptIds],
    weakConceptIds: [...game.weakConceptIds],
  };
}

function cloneSubjectProgress(
  subjectProgress: Record<string, SubjectProgressSnapshot>,
): Record<string, SubjectProgressSnapshot> {
  return Object.fromEntries(
    Object.entries(subjectProgress).map(([subjectId, snapshot]) => [
      subjectId,
      {
        ...snapshot,
        masteryByUnit: { ...snapshot.masteryByUnit },
      },
    ]),
  );
}

export function buildPersistedAppStoreState(
  state: PersistedAppStoreState,
): PersistedAppStoreState {
  return {
    ...state,
    masteryByConceptId: { ...state.masteryByConceptId },
    subjectProgress: cloneSubjectProgress(state.subjectProgress),
    reviewQueue: state.reviewQueue.map((item) => ({ ...item, sourceTitles: [...item.sourceTitles] })),
    sessionHistory: state.sessionHistory.map((entry) => ({ ...entry })),
    currentGame: cloneGameSession(state.currentGame),
    lastResult: state.lastResult
      ? {
          ...state.lastResult,
          weakConceptIds: [...state.lastResult.weakConceptIds],
        }
      : undefined,
  };
}

export function restorePersistedAppStoreState(
  state?: Partial<PersistedAppStoreState>,
): RestoredAppStoreState {
  const currentGame = cloneGameSession(state?.currentGame);
  const lastResult = state?.lastResult
    ? {
        ...state.lastResult,
        weakConceptIds: [...state.lastResult.weakConceptIds],
      }
    : undefined;

  if (currentGame) {
    return {
      onboardingComplete: state?.onboardingComplete ?? false,
      selectedMode: state?.selectedMode ?? "highSchool",
      focusPreset: state?.focusPreset ?? "highSchool",
      selectedSubjectId: state?.selectedSubjectId,
      selectedUnitId: state?.selectedUnitId,
      subjectSearch: state?.subjectSearch ?? "",
      subjectFilter: state?.subjectFilter ?? "all",
      difficulty: state?.difficulty ?? "easy",
      goal: state?.goal ?? "habit",
      masteryByConceptId: { ...(state?.masteryByConceptId ?? {}) },
      subjectProgress: cloneSubjectProgress(state?.subjectProgress ?? {}),
      reviewQueue: (state?.reviewQueue ?? []).map((item) => ({
        ...item,
        sourceTitles: [...item.sourceTitles],
      })),
      sessionHistory: (state?.sessionHistory ?? []).map((entry) => ({ ...entry })),
      currentGame: {
        ...currentGame,
        paused: true,
      },
      lastResult,
      streakDays: state?.streakDays ?? 0,
      lastStudyDate: state?.lastStudyDate,
      activeScreen: "game",
    };
  }

  return {
    onboardingComplete: state?.onboardingComplete ?? false,
    selectedMode: state?.selectedMode ?? "highSchool",
    focusPreset: state?.focusPreset ?? "highSchool",
    selectedSubjectId: state?.selectedSubjectId,
    selectedUnitId: state?.selectedUnitId,
    subjectSearch: state?.subjectSearch ?? "",
    subjectFilter: state?.subjectFilter ?? "all",
    difficulty: state?.difficulty ?? "easy",
    goal: state?.goal ?? "habit",
    masteryByConceptId: { ...(state?.masteryByConceptId ?? {}) },
    subjectProgress: cloneSubjectProgress(state?.subjectProgress ?? {}),
    reviewQueue: (state?.reviewQueue ?? []).map((item) => ({
      ...item,
      sourceTitles: [...item.sourceTitles],
    })),
    sessionHistory: (state?.sessionHistory ?? []).map((entry) => ({ ...entry })),
    currentGame: undefined,
    lastResult,
    streakDays: state?.streakDays ?? 0,
    lastStudyDate: state?.lastStudyDate,
    activeScreen: lastResult
      ? "result"
      : state?.onboardingComplete
        ? "category"
        : "onboarding",
  };
}

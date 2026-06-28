export type TrackType = "highSchool" | "certification";
export type Difficulty = "easy" | "normal" | "hard" | "exam";
export type LearningGoal = "habit" | "mastery" | "exam";
export type ContentReviewStatus = "sample" | "draft" | "approved";
export type ContentCopyrightStatus = "unknown" | "cleared" | "restricted";
export type Direction = "up" | "down" | "left" | "right";
export type ScreenName =
  | "onboarding"
  | "category"
  | "subject"
  | "unit"
  | "game"
  | "review"
  | "stats"
  | "result";
export type CategoryPreset =
  | "highSchool"
  | "certification"
  | "todayReview"
  | "wrongAnswers"
  | "weakness"
  | "quick"
  | "examCram";
export type SubjectCluster =
  | "common"
  | "humanities"
  | "science"
  | "technology"
  | "language"
  | "certification";
export type SubjectFilter = SubjectCluster | "all";
export type BlockType =
  | "term"
  | "definition"
  | "formula"
  | "law"
  | "date"
  | "person"
  | "event"
  | "cause"
  | "result"
  | "example"
  | "classification"
  | "process"
  | "risk"
  | "symptom"
  | "principle"
  | "pair"
  | "quiz"
  | "trap";
export type QuizType = "ox" | "multipleChoice" | "fillBlank" | "matching";

export interface SubjectDefinition {
  id: string;
  name: string;
  mode: TrackType;
  cluster: SubjectCluster;
  searchTags: string[];
  headline: string;
  unitIds: string[];
  totalConcepts: number;
  totalQuizzes: number;
  estimatedMinutes: number;
  isPlayable: boolean;
  examTarget?: string;
  sourceRef?: string;
  reviewStatus?: ContentReviewStatus;
  copyrightStatus?: ContentCopyrightStatus;
}

export interface ConceptDefinition {
  id: string;
  subjectId: string;
  unitId: string;
  title: string;
  shortDefinition: string;
  blockType: BlockType;
  mergeGroupId: string;
  stage: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisiteConceptIds?: string[];
  relatedConceptIds: string[];
  wrongConfuserIds: string[];
  explanation: string;
  isSpawnable: boolean;
  spawnWeight?: number;
  isTrap?: boolean;
  examTip: string;
  sourceRef?: string;
  reviewStatus?: ContentReviewStatus;
  copyrightStatus?: ContentCopyrightStatus;
  practiceQuiz: Quiz;
}

export interface MergeRecipe {
  id: string;
  sourceConceptIds: [string, string];
  resultConceptId: string;
  quizId: string;
  explanation: string;
  priority: number;
  sourceRef?: string;
  reviewStatus?: ContentReviewStatus;
  copyrightStatus?: ContentCopyrightStatus;
}

interface QuizBase {
  id: string;
  type: QuizType;
  prompt: string;
  explanation: string;
  sourceRef?: string;
  reviewStatus?: ContentReviewStatus;
  copyrightStatus?: ContentCopyrightStatus;
}

export interface OxQuiz extends QuizBase {
  type: "ox";
  correctAnswer: boolean;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceQuiz extends QuizBase {
  type: "multipleChoice";
  options: MultipleChoiceOption[];
  correctOptionId: string;
}

export interface FillBlankQuiz extends QuizBase {
  type: "fillBlank";
  placeholder: string;
  acceptableAnswers: string[];
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingQuiz extends QuizBase {
  type: "matching";
  pairs: MatchingPair[];
  choices: string[];
}

export type Quiz = OxQuiz | MultipleChoiceQuiz | FillBlankQuiz | MatchingQuiz;

export interface UnitContent {
  id: string;
  subjectId: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  examImportance: 1 | 2 | 3 | 4 | 5;
  concepts: ConceptDefinition[];
  recipes: MergeRecipe[];
  quizzes: Quiz[];
  sourceRef?: string;
  reviewStatus?: ContentReviewStatus;
  copyrightStatus?: ContentCopyrightStatus;
}

export interface Tile {
  instanceId: string;
  conceptId: string;
  title: string;
  blockType: BlockType;
  mergeGroupId: string;
  stage: number;
  isTrap?: boolean;
}

export type BoardCell = Tile | null;

export interface PendingQuiz {
  recipeId?: string;
  quizId: string;
  mergedConceptId: string;
  mergedTileId: string;
  sourceConceptIds: [string, string];
  previewBoard: BoardCell[];
  mergeReason: "recipe" | "group" | "related";
}

export type QuizResponse = boolean | string | Record<string, string>;

export interface ReviewItem {
  id: string;
  subjectId: string;
  unitId: string;
  conceptId: string;
  prompt: string;
  explanation: string;
  sourceTitles: string[];
  incorrectCount: number;
  mastery: number;
  reviewPriority: number;
  nextReviewLabel: string;
  createdAt: string;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}

export interface SessionHistoryEntry {
  id: string;
  subjectId: string;
  unitId: string;
  focusPreset: CategoryPreset;
  difficulty: Difficulty;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  durationSeconds: number;
  completedAt: string;
}

export interface SessionResult {
  subjectId: string;
  subjectName: string;
  unitId: string;
  unitTitle: string;
  focusPreset: CategoryPreset;
  difficulty: Difficulty;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  bestCombo: number;
  studiedConceptCount: number;
  weakConceptIds: string[];
  recommendedNextStep: string;
  durationSeconds: number;
  reason: "clear" | "blocked" | "time" | "quit";
  completedAt: string;
}

export interface SubjectProgressSnapshot {
  subjectId: string;
  sessions: number;
  correctAnswers: number;
  wrongAnswers: number;
  studySeconds: number;
  masteryByUnit: Record<string, number>;
  lastPlayedAt?: string;
}

export interface GameSession {
  subjectId: string;
  unitId: string;
  focusPreset: CategoryPreset;
  difficulty: Difficulty;
  boardSize: number;
  board: BoardCell[];
  score: number;
  combo: number;
  bestCombo: number;
  turns: number;
  nextTileId: number;
  pendingQuizzes: PendingQuiz[];
  pendingSpawnCount: number;
  remainingSeconds: number;
  elapsedSeconds: number;
  paused: boolean;
  startedAt: string;
  correctAnswers: number;
  wrongAnswers: number;
  learnedConceptIds: string[];
  weakConceptIds: string[];
  lastExplanationConceptId?: string;
}

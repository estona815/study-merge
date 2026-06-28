import React, { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { BoardView } from "../components/BoardView";
import { QuizModal } from "../components/QuizModal";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";
import { formatDuration, palette } from "../constants/theme";
import { getSubjectById } from "../data/subjectCatalog";
import { getUnitContent } from "../data/sampleContent";
import { evaluateQuizAnswer, findHintPairs, getQuizById } from "../engine/gameEngine";
import { QuizResponse } from "../types/models";
import { useAppStore } from "../store/useAppStore";

const presetLabels = {
  highSchool: "고등학교 학습",
  certification: "자격증 학습",
  todayReview: "오늘의 복습",
  wrongAnswers: "오답 블록",
  weakness: "약점 집중",
  quick: "3분 게임",
  examCram: "시험 직전 암기",
} as const;

export function GameScreen() {
  const { width } = useWindowDimensions();
  const [quizFeedback, setQuizFeedback] = useState<{
    quizId: string;
    isCorrect: boolean;
    response: QuizResponse;
  } | null>(null);
  const currentGame = useAppStore((state) => state.currentGame);
  const move = useAppStore((state) => state.move);
  const submitQuiz = useAppStore((state) => state.submitQuiz);
  const tickGameTimer = useAppStore((state) => state.tickGameTimer);
  const pauseGame = useAppStore((state) => state.pauseGame);
  const resumeGame = useAppStore((state) => state.resumeGame);
  const finishGame = useAppStore((state) => state.finishGame);
  const openReview = useAppStore((state) => state.openReview);
  const openStats = useAppStore((state) => state.openStats);
  const goToSubjects = useAppStore((state) => state.goToSubjects);
  const activePendingQuiz = currentGame?.pendingQuizzes[0];
  const subject = currentGame ? getSubjectById(currentGame.subjectId) : undefined;
  const unit = currentGame ? getUnitContent(currentGame.unitId) : undefined;
  const quiz =
    unit && activePendingQuiz
      ? getQuizById(unit, activePendingQuiz.quizId)
      : undefined;

  useEffect(() => {
    if (!currentGame || currentGame.paused || currentGame.pendingQuizzes.length > 0) {
      return;
    }

    const timer = setInterval(() => {
      tickGameTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [currentGame?.paused, currentGame?.pendingQuizzes.length, currentGame?.unitId, tickGameTimer]);

  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof window === "undefined" ||
      !currentGame ||
      currentGame.paused ||
      currentGame.pendingQuizzes.length > 0
    ) {
      return;
    }

    const directionByKey = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    } as const;

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = directionByKey[event.key as keyof typeof directionByKey];
      if (!direction) {
        return;
      }

      event.preventDefault();
      move(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGame, move]);

  useEffect(() => {
    setQuizFeedback((current) =>
      current && current.quizId === quiz?.id ? current : null,
    );
  }, [quiz?.id]);

  if (!currentGame) {
    return (
      <ScreenLayout
        title="게임 준비 중"
        subtitle="현재 활성 세션이 없습니다. 과목과 단원을 다시 고르면 바로 시작할 수 있습니다."
      >
        <ActionButton label="과목 선택으로" onPress={() => goToSubjects()} />
      </ScreenLayout>
    );
  }

  if (!subject || !unit) {
    return (
      <ScreenLayout
        title="데이터 로드 실패"
        subtitle="선택한 단원 데이터를 찾지 못했습니다. 과목 선택으로 돌아가 다시 시작해 주세요."
      >
        <ActionButton label="과목 선택으로" onPress={() => goToSubjects()} />
      </ScreenLayout>
    );
  }

  const focusConceptId =
    activePendingQuiz?.mergedConceptId ?? currentGame.lastExplanationConceptId;
  const focusConcept = useMemo(
    () =>
      focusConceptId
        ? unit.concepts.find((concept) => concept.id === focusConceptId)
        : undefined,
    [focusConceptId, unit.concepts],
  );
  const hintPairs = useMemo(
    () =>
      currentGame.difficulty === "easy"
        ? findHintPairs(currentGame.board, unit, currentGame.boardSize).slice(0, 2)
        : [],
    [currentGame.board, currentGame.boardSize, currentGame.difficulty, unit],
  );
  const emptyCount = useMemo(
    () => currentGame.board.filter((cell) => cell === null).length,
    [currentGame.board],
  );
  const isWide = width >= 1040;
  const interactionTip =
    Platform.OS === "web"
      ? "방향키 또는 방향 버튼으로 관련 개념을 합치고, 퀴즈로 합성을 확정하세요."
      : "스와이프하거나 방향 버튼을 눌러 관련 개념을 합치고, 퀴즈로 합성을 확정하세요.";
  const sessionStateLabel = currentGame.paused
    ? "일시정지됨"
    : currentGame.pendingQuizzes.length > 0
      ? "퀴즈 해결 대기"
      : "이동 가능";
  const sessionGuidance = currentGame.pendingQuizzes.length > 0
    ? "개념 합성이 끝났습니다. 퀴즈를 풀어 학습 확정을 마무리하세요."
    : currentGame.paused
      ? "세션이 멈춰 있습니다. 이어하기를 누르면 타이머와 이동이 다시 시작됩니다."
      : hintPairs.length > 0
        ? "관련 개념 힌트를 참고해 다음 개념 합성을 이어가세요."
        : "보드 전체를 훑어 다음 연결 고리를 찾아보세요.";

  const handleQuizPreview = (response: QuizResponse) => {
    if (!quiz) {
      return;
    }

    setQuizFeedback({
      quizId: quiz.id,
      isCorrect: evaluateQuizAnswer(quiz, response),
      response,
    });
  };

  const handleQuizContinue = () => {
    if (!quizFeedback) {
      return;
    }

    submitQuiz(quizFeedback.response);
    setQuizFeedback(null);
  };

  return (
    <ScreenLayout
      title={`${subject.name} · ${unit.title}`}
      subtitle={interactionTip}
    >
      <View style={[styles.gameLayout, isWide && styles.gameLayoutWide]}>
        <View style={styles.boardColumn}>
          <SectionCard>
            <BoardView
              board={currentGame.board}
              boardSize={currentGame.boardSize}
              disabled={currentGame.paused || currentGame.pendingQuizzes.length > 0}
              onMove={move}
            />
          </SectionCard>

          <View style={styles.bottomRow}>
            <ActionButton label="복습 큐" onPress={openReview} variant="secondary" compact />
            <ActionButton label="통계" onPress={openStats} variant="ghost" compact />
          </View>
        </View>

        <View style={styles.sidebarColumn}>
          <SectionCard>
            <View style={styles.metricsHeader}>
              <InfoChip label={presetLabels[currentGame.focusPreset]} />
              <InfoChip label={sessionStateLabel} />
            </View>
            <Text style={styles.statusBody}>{sessionGuidance}</Text>
            <View style={styles.metricsWrap}>
              <Metric label="점수" value={String(currentGame.score)} />
              <Metric label="콤보" value={String(currentGame.combo)} />
              <Metric label="남은 칸" value={String(emptyCount)} />
              <Metric label="타이머" value={formatDuration(currentGame.remainingSeconds)} />
              <Metric label="대기 퀴즈" value={String(currentGame.pendingQuizzes.length)} />
              <Metric label="오늘 익힌 개념" value={String(currentGame.learnedConceptIds.length)} />
              <Metric label="다시 연결할 개념" value={String(currentGame.weakConceptIds.length)} />
            </View>
            <View style={styles.toolbar}>
              <InfoChip label={`${currentGame.boardSize}x${currentGame.boardSize} 보드`} />
              {Platform.OS === "web" ? <InfoChip label="방향키 지원" /> : null}
            </View>
            <View style={styles.toolbarButtons}>
              <ActionButton
                label={currentGame.paused ? "이어하기" : "일시정지"}
                onPress={currentGame.paused ? resumeGame : pauseGame}
                compact
                variant="ghost"
              />
              <ActionButton
                label="세션 종료"
                onPress={() => finishGame("quit")}
                compact
                variant="danger"
              />
            </View>
          </SectionCard>

          {hintPairs.length ? (
            <SectionCard>
              <InfoChip label="관련 개념 힌트" />
              {hintPairs.map((hint) => (
                <Text key={hint} style={styles.bodyText}>
                  {hint}
                </Text>
              ))}
            </SectionCard>
          ) : null}

          {focusConcept ? (
            <SectionCard>
              <InfoChip label="개념 합성 설명" />
              <Text style={styles.focusTitle}>{focusConcept.title}</Text>
              <Text style={styles.bodyText}>{focusConcept.shortDefinition}</Text>
              <Text style={styles.tipText}>시험 포인트: {focusConcept.examTip}</Text>
            </SectionCard>
          ) : null}

          <SectionCard>
            <InfoChip label="진행 규칙" />
            <Text style={styles.bodyText}>
              정답이면 숙련도와 콤보가 오르고, 오답은 바로 복습 큐에 저장됩니다.
            </Text>
            <Text style={styles.tipText}>
              지금 난이도는 {currentGame.difficulty === "easy" ? "힌트 제공" : currentGame.difficulty === "exam" ? "제한 시간 집중" : currentGame.difficulty === "hard" ? "함정 블록 포함 가능" : "기본 합성 규칙"} 모드입니다.
            </Text>
          </SectionCard>
        </View>
      </View>
      <QuizModal
        visible={Boolean(quiz)}
        quiz={quiz}
        onClose={() => {}}
        onSubmit={handleQuizPreview}
        dismissible={false}
        feedback={quizFeedback}
        onContinue={handleQuizContinue}
      />
    </ScreenLayout>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gameLayout: {
    gap: 16,
  },
  gameLayoutWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  boardColumn: {
    flex: 1.25,
    gap: 14,
  },
  sidebarColumn: {
    flex: 0.95,
    gap: 14,
  },
  metricsHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statusBody: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
  },
  metricCard: {
    minWidth: "47%",
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.muted,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
  },
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  toolbarButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.ink,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
  bottomRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

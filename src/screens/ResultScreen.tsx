import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatStudyMinutes, palette } from "../constants/theme";
import { getConceptById } from "../data/sampleContent";
import { useAppStore } from "../store/useAppStore";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";

const reasonContent = {
  clear: {
    label: "단원 완료",
    title: "학습 흐름을 끝까지 밀어냈습니다.",
    description: "보드와 퀴즈를 모두 정리한 결과입니다. 다음 단원으로 넘어가거나 같은 단원을 더 빠르게 반복해 볼 수 있습니다.",
  },
  blocked: {
    label: "보드 종료",
    title: "합칠 수 있는 블록이 모두 소진되었습니다.",
    description: "복습 큐에 쌓인 약점 개념을 먼저 다지고 다시 도전하면 더 오래 버틸 수 있습니다.",
  },
  time: {
    label: "시간 종료",
    title: "제한 시간이 끝났습니다.",
    description: "시험 직전 모드에 맞는 속도 훈련이 필요합니다. 같은 단원을 다시 시작해 속도와 정확도를 함께 올려 보세요.",
  },
  quit: {
    label: "중간 종료",
    title: "세션을 정리하고 결과만 저장했습니다.",
    description: "진행 중이던 흐름은 보존되지 않지만, 같은 단원을 같은 난이도로 바로 다시 시작할 수 있습니다.",
  },
} as const;

const difficultyLabel = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
  exam: "시험직전",
} as const;

const presetLabel = {
  highSchool: "고등학교 학습",
  certification: "자격증 학습",
  todayReview: "오늘의 복습",
  wrongAnswers: "오답 블록",
  weakness: "약점 집중",
  quick: "3분 게임",
  examCram: "시험 직전 암기",
} as const;

export function ResultScreen() {
  const lastResult = useAppStore((state) => state.lastResult);
  const restartLastUnit = useAppStore((state) => state.restartLastUnit);
  const openReview = useAppStore((state) => state.openReview);
  const openStats = useAppStore((state) => state.openStats);
  const openCategory = useAppStore((state) => state.openCategory);

  if (!lastResult) {
    return (
      <ScreenLayout
        title="결과 없음"
        subtitle="아직 완료된 세션이 없습니다. 단원을 시작하면 학습 결과를 여기서 볼 수 있습니다."
      >
        <ActionButton label="카테고리로" onPress={openCategory} />
      </ScreenLayout>
    );
  }

  const summary = reasonContent[lastResult.reason];

  return (
    <ScreenLayout
      title="학습 결과"
      subtitle={`${lastResult.subjectName} · ${lastResult.unitTitle}`}
    >
      <SectionCard>
        <View style={styles.summaryRow}>
          <InfoChip label={summary.label} />
          <InfoChip label={presetLabel[lastResult.focusPreset]} />
          <InfoChip label={difficultyLabel[lastResult.difficulty]} />
        </View>
        <Text style={styles.summaryTitle}>{summary.title}</Text>
        <Text style={styles.bodyText}>{summary.description}</Text>
      </SectionCard>

      <SectionCard>
        <View style={styles.grid}>
          <Metric label="점수" value={String(lastResult.score)} />
          <Metric label="정답" value={String(lastResult.correctAnswers)} />
          <Metric label="오답" value={String(lastResult.wrongAnswers)} />
          <Metric label="최고 콤보" value={String(lastResult.bestCombo)} />
          <Metric label="학습 개념" value={String(lastResult.studiedConceptCount)} />
          <Metric label="플레이 시간" value={formatStudyMinutes(lastResult.durationSeconds)} />
        </View>
      </SectionCard>

      <SectionCard>
        <InfoChip label="학습 요약" />
        <Text style={styles.bodyText}>오늘 익힌 개념 {lastResult.studiedConceptCount}개를 세션 결과로 확정했습니다.</Text>
        <InfoChip label="추천 다음 행동" />
        <Text style={styles.bodyText}>{lastResult.recommendedNextStep}</Text>
        {lastResult.weakConceptIds.length ? (
          <View style={styles.column}>
            {lastResult.weakConceptIds.map((conceptId) => (
              <Text key={conceptId} style={styles.weakItem}>
                다시 연결할 개념: {getConceptById(conceptId)?.title ?? conceptId}
              </Text>
            ))}
          </View>
        ) : null}
      </SectionCard>

      <View style={styles.buttonStack}>
        <ActionButton label="같은 단원 다시" onPress={restartLastUnit} />
        <ActionButton label="오답 블록 보기" onPress={openReview} variant="secondary" />
        <ActionButton label="통계 보기" onPress={openStats} variant="ghost" />
        <ActionButton label="카테고리로" onPress={openCategory} variant="ghost" />
      </View>
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
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: palette.ink,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    width: "47%",
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
  },
  metricLabel: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: "700",
  },
  metricValue: {
    marginTop: 4,
    fontSize: 18,
    color: palette.ink,
    fontWeight: "800",
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: palette.ink,
  },
  column: {
    gap: 8,
  },
  weakItem: {
    fontSize: 14,
    color: palette.muted,
  },
  buttonStack: {
    gap: 10,
  },
});

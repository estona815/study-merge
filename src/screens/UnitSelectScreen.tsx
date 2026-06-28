import React from "react";
import {
  DimensionValue,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { formatCount, formatStudyMinutes, palette } from "../constants/theme";
import { LEGAL_REVIEW_NOTE, getSubjectUnits } from "../data/sampleContent";
import { getSubjectById } from "../data/subjectCatalog";
import { Difficulty } from "../types/models";
import { useAppStore } from "../store/useAppStore";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";

const difficultyOptions: Array<{
  id: Difficulty;
  title: string;
  caption: string;
}> = [
  { id: "easy", title: "쉬움", caption: "힌트 중심" },
  { id: "normal", title: "보통", caption: "기본 합성" },
  { id: "hard", title: "어려움", caption: "5x5 보드" },
  { id: "exam", title: "시험직전", caption: "제한 시간" },
];

export function UnitSelectScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 980;
  const selectedSubjectId = useAppStore((state) => state.selectedSubjectId);
  const difficulty = useAppStore((state) => state.difficulty);
  const subjectProgress = useAppStore((state) => state.subjectProgress);
  const setDifficulty = useAppStore((state) => state.setDifficulty);
  const goToSubjects = useAppStore((state) => state.goToSubjects);
  const startGame = useAppStore((state) => state.startGame);

  if (!selectedSubjectId) {
    return (
      <ScreenLayout
        title="단원 선택"
        subtitle="먼저 과목을 선택하면 샘플 단원 목록을 보여 드립니다."
      >
        <ActionButton label="과목 선택으로" onPress={() => goToSubjects()} />
      </ScreenLayout>
    );
  }

  const subject = getSubjectById(selectedSubjectId);
  const units = getSubjectUnits(selectedSubjectId);
  const progress = subjectProgress[selectedSubjectId];
  const masteryValues = Object.values(progress?.masteryByUnit ?? {});
  const averageMastery =
    masteryValues.length > 0
      ? Math.round(masteryValues.reduce((sum, value) => sum + value, 0) / masteryValues.length)
      : 0;

  return (
    <ScreenLayout
      title={subject?.name ?? "단원 선택"}
      subtitle="단원별로 다른 반복 각도와 난이도를 넣어서 같은 과목도 지루하지 않게 여러 번 돌릴 수 있도록 구성했습니다."
    >
      <SectionCard>
        <InfoChip label={subject?.examTarget ?? "과목 개요"} />
        <Text style={styles.heroTitle}>{subject?.headline ?? "단원 세부 루프를 고르세요."}</Text>
        <Text style={styles.heroBody}>
          총 {formatCount(units.length)}개 단원, {formatCount(subject?.totalConcepts ?? 0)}개 개념,
          {formatCount(subject?.totalQuizzes ?? 0)}개 퀴즈 구조가 이 과목 안에 준비되어 있습니다.
        </Text>
        <View style={styles.heroStats}>
          <MiniStat label="평균 숙련도" value={progress ? `${averageMastery}%` : "0%"} />
          <MiniStat label="누적 세션" value={`${formatCount(progress?.sessions ?? 0)}회`} />
          <MiniStat
            label="누적 시간"
            value={formatStudyMinutes((progress?.studySeconds ?? 0) || 0)}
          />
          <MiniStat
            label="전체 학습량"
            value={formatStudyMinutes((subject?.estimatedMinutes ?? 0) * 60)}
          />
        </View>
      </SectionCard>

      <SectionCard>
        <InfoChip label="플레이 설정" />
        <Text style={styles.sectionTitle}>현재 난이도와 보드 감각을 여기서 바로 바꿀 수 있습니다.</Text>
        <View style={styles.difficultyRow}>
          {difficultyOptions.map((option) => {
            const selected = difficulty === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setDifficulty(option.id)}
                style={[
                  styles.difficultyChip,
                  selected && styles.difficultyChipSelected,
                  { width: isWide ? "24%" : "48.5%" },
                ]}
              >
                <Text style={[styles.difficultyTitle, selected && styles.difficultyTitleSelected]}>
                  {option.title}
                </Text>
                <Text
                  style={[
                    styles.difficultyCaption,
                    selected && styles.difficultyCaptionSelected,
                  ]}
                >
                  {option.caption}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard>
        <View style={styles.sectionHeader}>
          <View>
            <InfoChip label="단원 루프" />
            <Text style={styles.sectionTitle}>
              단원 수는 늘렸지만, 엔진은 그대로라 바로 검수와 밸런싱이 가능합니다.
            </Text>
          </View>
          <ActionButton label="과목 목록" onPress={() => goToSubjects(subject?.mode)} variant="ghost" compact />
        </View>

        <View style={styles.unitGrid}>
          {units.map((unit) => {
            const mastery = progress?.masteryByUnit[unit.id] ?? 0;
            const progressWidth: DimensionValue = `${Math.max(mastery || 8, 8)}%`;

            return (
              <Pressable
                key={unit.id}
                onPress={() => startGame(unit.id)}
                style={[styles.unitCard, { width: isWide ? "48.7%" : "100%" }]}
              >
                <View style={styles.unitTopRow}>
                  <InfoChip label={unit.title} />
                  <Text style={styles.unitImportance}>중요도 {unit.examImportance}/5</Text>
                </View>
                <Text style={styles.unitSummary}>{unit.summary}</Text>
                <View style={styles.unitMetrics}>
                  <MetricLine label="예상 플레이" value={`${unit.estimatedMinutes}분`} />
                  <MetricLine label="개념 블록" value={`${formatCount(unit.concepts.length)}개`} />
                  <MetricLine label="합성 레시피" value={`${formatCount(unit.recipes.length)}개`} />
                  <MetricLine label="퀴즈 흐름" value={`${formatCount(unit.quizzes.length)}개`} />
                </View>
                <View style={styles.progressWrap}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>숙련도 {mastery}%</Text>
                    <Text style={styles.progressHint}>
                      {mastery > 0 ? "이전 기록 있음" : "첫 플레이 추천"}
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: progressWidth }]} />
                  </View>
                </View>
                <ActionButton label="이 단원 시작" onPress={() => startGame(unit.id)} compact />
              </Pressable>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard>
        <InfoChip label="법적 검토 메모" />
        <Text style={styles.noteText}>{LEGAL_REVIEW_NOTE}</Text>
      </SectionCard>
    </ScreenLayout>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatLabel}>{label}</Text>
      <Text style={styles.miniStatValue}>{value}</Text>
    </View>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricLine}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "800",
    color: palette.ink,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
  },
  heroStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  miniStat: {
    minWidth: 130,
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 2,
  },
  miniStatLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.muted,
  },
  miniStatValue: {
    fontSize: 17,
    fontWeight: "800",
    color: palette.ink,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: palette.ink,
  },
  difficultyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  difficultyChip: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4,
  },
  difficultyChipSelected: {
    backgroundColor: palette.tealSoft,
    borderColor: palette.teal,
  },
  difficultyTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "800",
  },
  difficultyTitleSelected: {
    color: palette.teal,
  },
  difficultyCaption: {
    color: palette.muted,
    fontSize: 12,
  },
  difficultyCaptionSelected: {
    color: palette.teal,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  unitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  unitCard: {
    padding: 16,
    borderRadius: 26,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
  },
  unitTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  unitImportance: {
    fontSize: 12,
    fontWeight: "800",
    color: palette.accent,
  },
  unitSummary: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.ink,
  },
  unitMetrics: {
    gap: 6,
  },
  metricLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metricLabel: {
    fontSize: 13,
    color: palette.muted,
  },
  metricValue: {
    fontSize: 13,
    color: palette.ink,
    fontWeight: "700",
  },
  progressWrap: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: palette.ink,
  },
  progressHint: {
    fontSize: 12,
    color: palette.muted,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#ece2d4",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.accent,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
});

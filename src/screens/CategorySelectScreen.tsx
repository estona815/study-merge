import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatCount, formatStudyMinutes, palette } from "../constants/theme";
import { getContentSummary } from "../data/subjectCatalog";
import { useAppStore } from "../store/useAppStore";
import { CategoryPreset } from "../types/models";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";

const modeCards: Array<{
  id: CategoryPreset;
  title: string;
  description: string;
}> = [
  {
    id: "highSchool",
    title: "고등학교 과목",
    description: "내신과 수능형 암기 과목을 골라 바로 플레이합니다.",
  },
  {
    id: "certification",
    title: "자격증 과목",
    description: "정보처리기사, 산업안전기사 같은 자격증 단원으로 이동합니다.",
  },
];

const focusCards: Array<{
  id: CategoryPreset;
  title: string;
  description: string;
}> = [
  {
    id: "todayReview",
    title: "오늘 복습",
    description: "리뷰 큐에 쌓인 개념부터 빠르게 다시 확인합니다.",
  },
  {
    id: "wrongAnswers",
    title: "오답 정리",
    description: "틀렸던 개념과 퀴즈를 우선으로 재도전합니다.",
  },
  {
    id: "weakness",
    title: "약점 보완",
    description: "누적 통계에서 취약한 과목과 단원을 먼저 찾습니다.",
  },
  {
    id: "quick",
    title: "3분 퀵런",
    description: "짧은 집중 세션으로 가볍게 학습 루틴을 이어 갑니다.",
  },
  {
    id: "examCram",
    title: "시험 직전",
    description: "짧은 제한 시간과 높은 밀도의 문제로 압축 복습합니다.",
  },
];

export function CategorySelectScreen() {
  const openPreset = useAppStore((state) => state.openPreset);
  const openStats = useAppStore((state) => state.openStats);
  const openReview = useAppStore((state) => state.openReview);
  const focusPreset = useAppStore((state) => state.focusPreset);
  const selectedMode = useAppStore((state) => state.selectedMode);
  const reviewQueue = useAppStore((state) => state.reviewQueue);
  const sessionHistory = useAppStore((state) => state.sessionHistory);
  const streakDays = useAppStore((state) => state.streakDays);

  const totalStudySeconds = sessionHistory.reduce(
    (sum, entry) => sum + entry.durationSeconds,
    0,
  );
  const overallSummary = getContentSummary();
  const highSchoolSummary = getContentSummary("highSchool");
  const certificationSummary = getContentSummary("certification");

  return (
    <ScreenLayout
      title="Study Merge"
      subtitle="개념 수천 개를 같은 게임 엔진으로 순환시키는 학습 앱입니다. 과목 탐색, 복습, 약점 보완, 시험 직전 루프를 한 화면에서 바로 여세요."
    >
      <SectionCard>
        <InfoChip label="콘텐츠 현황" />
        <Text style={styles.heroTitle}>
          현재 빌드 기준 {formatCount(overallSummary.conceptCount)}개 개념,{" "}
          {formatCount(overallSummary.unitCount)}개 단원, {formatCount(overallSummary.quizCount)}개
          퀴즈 구조를 바로 검수할 수 있습니다.
        </Text>
        <Text style={styles.heroBody}>
          고등학교와 자격증이 같은 보드 엔진을 공유하고, 단원만 바뀌어도 다른 반복 감각을 주도록 확장했습니다.
        </Text>
        <View style={styles.metricRow}>
          <MetricCard label="총 개념 수" value={`${formatCount(overallSummary.conceptCount)}개`} />
          <MetricCard label="총 단원 수" value={`${formatCount(overallSummary.unitCount)}개`} />
          <MetricCard
            label="복습 큐"
            value={`${formatCount(reviewQueue.length)}개`}
          />
          <MetricCard
            label="연속 학습"
            value={`${formatCount(streakDays || 0)}일`}
          />
        </View>
        <Text style={styles.summaryLine}>
          고등학교 {highSchoolSummary.subjectCount}과목 · {formatCount(highSchoolSummary.conceptCount)}개 개념
          / 자격증 {certificationSummary.subjectCount}과목 · {formatCount(certificationSummary.conceptCount)}개 개념
        </Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>과목으로 시작</Text>
        <Text style={styles.sectionDescription}>
          볼륨이 큰 메인 루프입니다. 바로 단원 목록으로 들어가서 여러 라운드를 이어서 검수할 수 있습니다.
        </Text>
        <View style={styles.stack}>
          <PresetCard
            active={selectedMode === "highSchool"}
            title="고등학교 과목"
            description={`내신과 수능형 암기 과목을 골라 바로 플레이합니다. 현재 ${highSchoolSummary.subjectCount}과목 · ${formatCount(highSchoolSummary.unitCount)}개 단원`}
            onPress={() => openPreset("highSchool")}
          />
          <PresetCard
            active={selectedMode === "certification"}
            title="자격증 과목"
            description={`정보처리기사, 산업안전기사 같은 자격증 단원으로 이동합니다. 현재 ${certificationSummary.subjectCount}과목 · ${formatCount(certificationSummary.unitCount)}개 단원`}
            onPress={() => openPreset("certification")}
          />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>집중 모드</Text>
        <Text style={styles.sectionDescription}>
          누적 기록이 쌓일수록 더 의미가 커지는 보조 루프입니다. 오답과 취약 개념을 바로 다시 태울 수 있습니다.
        </Text>
        <View style={styles.stack}>
          {focusCards.map((card) => (
            <PresetCard
              key={card.id}
              active={focusPreset === card.id}
              title={card.title}
              description={card.description}
              onPress={() => openPreset(card.id)}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>빠른 이동</Text>
        <Text style={styles.sectionDescription}>
          최근 누적 학습 시간은 {formatStudyMinutes(totalStudySeconds)}입니다. 검수 중에는 복습 큐와 통계를 왔다 갔다 하면서 흐름을 보는 편이 가장 빠릅니다.
        </Text>
        <View style={styles.quickActions}>
          <ActionButton label="복습 화면 열기" onPress={openReview} variant="secondary" />
          <ActionButton label="누적 통계 보기" onPress={openStats} variant="ghost" />
        </View>
      </SectionCard>
    </ScreenLayout>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function PresetCard({
  active,
  title,
  description,
  onPress,
}: {
  active: boolean;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.presetCard, active && styles.presetCardActive]}
    >
      <Text style={styles.presetTitle}>{title}</Text>
      <Text style={styles.presetDescription}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "800",
    color: palette.ink,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 140,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: palette.muted,
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 20,
    color: palette.ink,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
  },
  summaryLine: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.ink,
  },
  stack: {
    gap: 10,
  },
  presetCard: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#fff",
    gap: 6,
  },
  presetCardActive: {
    borderColor: palette.accent,
    backgroundColor: palette.accentSoft,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.ink,
  },
  presetDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.muted,
  },
  quickActions: {
    gap: 10,
  },
});

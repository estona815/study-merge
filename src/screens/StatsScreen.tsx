import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatStudyMinutes, palette } from "../constants/theme";
import { getConceptById } from "../data/sampleContent";
import { getSubjectById } from "../data/subjectCatalog";
import { useAppStore } from "../store/useAppStore";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";

const presetLabel = {
  highSchool: "고등학교",
  certification: "자격증",
  todayReview: "복습",
  wrongAnswers: "오답",
  weakness: "약점",
  quick: "3분",
  examCram: "시험직전",
} as const;

const difficultyLabel = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
  exam: "시험직전",
} as const;

export function StatsScreen() {
  const subjectProgress = useAppStore((state) => state.subjectProgress);
  const sessionHistory = useAppStore((state) => state.sessionHistory);
  const reviewQueue = useAppStore((state) => state.reviewQueue);
  const streakDays = useAppStore((state) => state.streakDays);
  const openCategory = useAppStore((state) => state.openCategory);

  const subjects = useMemo(() => Object.values(subjectProgress), [subjectProgress]);
  const weakRanking = useMemo(
    () =>
      [...reviewQueue]
        .sort((left, right) => right.reviewPriority - left.reviewPriority)
        .slice(0, 5),
    [reviewQueue],
  );
  const totalCorrect = subjects.reduce((sum, subject) => sum + subject.correctAnswers, 0);
  const totalWrong = subjects.reduce((sum, subject) => sum + subject.wrongAnswers, 0);
  const totalStudySeconds = subjects.reduce((sum, subject) => sum + subject.studySeconds, 0);
  const totalAnswered = totalCorrect + totalWrong;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const topSubject = useMemo(
    () =>
      subjects.length > 0
        ? [...subjects].sort((left, right) => right.studySeconds - left.studySeconds)[0]
        : undefined,
    [subjects],
  );
  const recentModes = useMemo(() => sessionHistory.slice(0, 5), [sessionHistory]);

  return (
    <ScreenLayout
      title="학습 통계"
      subtitle="로컬 저장소에 기록된 진행률, 약점, 최근 세션을 한눈에 확인합니다."
    >
      <SectionCard>
        <View style={styles.grid}>
          <Metric label="총 학습 시간" value={formatStudyMinutes(totalStudySeconds)} />
          <Metric label="정답 수" value={String(totalCorrect)} />
          <Metric label="오답 수" value={String(totalWrong)} />
          <Metric label="연속 학습일" value={`${streakDays}일`} />
        </View>
      </SectionCard>

      <SectionCard>
        <InfoChip label="현재 페이스" />
        <Text style={styles.subjectTitle}>
          정답률 {accuracy}%{topSubject ? ` · 가장 오래 한 과목 ${getSubjectById(topSubject.subjectId)?.name ?? topSubject.subjectId}` : ""}
        </Text>
        <Text style={styles.bodyText}>
          {totalAnswered > 0
            ? `지금까지 총 ${totalAnswered}문항을 처리했습니다. 취약 개념 ${reviewQueue.length}개가 다음 복습 대상으로 남아 있습니다.`
            : "아직 누적 풀이 기록이 없습니다. 한 판만 시작해도 숙련도와 약점 집계가 쌓이기 시작합니다."}
        </Text>
      </SectionCard>

      <SectionCard>
        <InfoChip label="과목별 진행률" />
        {subjects.length === 0 ? (
          <Text style={styles.bodyText}>아직 플레이 기록이 없습니다.</Text>
        ) : (
          subjects.map((item) => {
            const subject = getSubjectById(item.subjectId);
            const masteryValues = Object.values(item.masteryByUnit);
            const averageMastery =
              masteryValues.length > 0
                ? Math.round(
                    masteryValues.reduce((sum, value) => sum + value, 0) /
                      masteryValues.length,
                  )
                : 0;

            return (
              <View key={item.subjectId} style={styles.subjectRow}>
                <Text style={styles.subjectTitle}>{subject?.name ?? item.subjectId}</Text>
                <Text style={styles.metaText}>
                  세션 {item.sessions}회 · 평균 숙련도 {averageMastery}% · 학습 시간{" "}
                  {formatStudyMinutes(item.studySeconds)}
                </Text>
                <ProgressBar value={averageMastery} />
              </View>
            );
          })
        )}
      </SectionCard>

      <SectionCard>
        <InfoChip label="다시 연결할 개념" />
        {weakRanking.length === 0 ? (
          <Text style={styles.bodyText}>현재 복습 대기 중인 취약 개념이 없습니다.</Text>
        ) : (
          weakRanking.map((item) => (
            <Text key={item.id} style={styles.metaText}>
              {getConceptById(item.conceptId)?.title ?? item.conceptId} · {item.nextReviewLabel} · 우선순위 {item.reviewPriority.toFixed(1)}
            </Text>
          ))
        )}
      </SectionCard>

      <SectionCard>
        <InfoChip label="최근 세션" />
        {sessionHistory.length === 0 ? (
          <Text style={styles.bodyText}>최근 세션 기록이 없습니다.</Text>
        ) : (
          recentModes.map((session) => {
            const subject = getSubjectById(session.subjectId);
            return (
              <View key={session.id} style={styles.subjectRow}>
                <Text style={styles.subjectTitle}>{subject?.name ?? session.subjectId}</Text>
                <Text style={styles.metaText}>
                  점수 {session.score} · 정답 {session.correctAnswers} · 오답 {session.wrongAnswers}
                </Text>
                <Text style={styles.metaText}>
                  {presetLabel[session.focusPreset]} · {difficultyLabel[session.difficulty]} · {formatStudyMinutes(session.durationSeconds)}
                </Text>
              </View>
            );
          })
        )}
      </SectionCard>

      <ActionButton label="카테고리로" onPress={openCategory} />
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

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(4, value)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 14,
    lineHeight: 20,
    color: palette.ink,
  },
  subjectRow: {
    gap: 4,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.ink,
  },
  metaText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#efe4d2",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.teal,
  },
});

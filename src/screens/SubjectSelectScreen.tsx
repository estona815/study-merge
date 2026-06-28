import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { formatCount, formatStudyMinutes, palette } from "../constants/theme";
import { getContentSummary, getSubjectCatalog } from "../data/subjectCatalog";
import { FilterTabs } from "../components/FilterTabs";
import { useAppStore } from "../store/useAppStore";
import { SubjectFilter } from "../types/models";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";

const modeLabel = {
  highSchool: "고등학교 과목",
  certification: "자격증 과목",
};

export function SubjectSelectScreen() {
  const selectedMode = useAppStore((state) => state.selectedMode);
  const subjectSearch = useAppStore((state) => state.subjectSearch);
  const subjectFilter = useAppStore((state) => state.subjectFilter);
  const setSubjectSearch = useAppStore((state) => state.setSubjectSearch);
  const setSubjectFilter = useAppStore((state) => state.setSubjectFilter);
  const selectSubject = useAppStore((state) => state.selectSubject);
  const openCategory = useAppStore((state) => state.openCategory);
  const openStats = useAppStore((state) => state.openStats);
  const subjectProgress = useAppStore((state) => state.subjectProgress);
  const deferredSearch = React.useDeferredValue(subjectSearch);
  const summary = getContentSummary(selectedMode);

  const filterOptions =
    selectedMode === "highSchool"
      ? [
          { id: "all", label: "전체" },
          { id: "common", label: "공통" },
          { id: "humanities", label: "문과" },
          { id: "science", label: "이과" },
          { id: "technology", label: "기술" },
          { id: "language", label: "언어" },
        ]
      : [
          { id: "all", label: "전체" },
          { id: "certification", label: "자격증" },
        ];

  const subjects = useMemo(() => {
    return getSubjectCatalog(selectedMode).filter((subject) => {
      const query = deferredSearch.trim().toLowerCase();
      const matchesFilter =
        subjectFilter === "all" ? true : subject.cluster === subjectFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        subject.name.toLowerCase().includes(query) ||
        subject.searchTags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [deferredSearch, selectedMode, subjectFilter]);

  return (
    <ScreenLayout
      title="과목 선택"
      subtitle={`${modeLabel[selectedMode]}를 검색과 필터로 바로 좁히고, 개념 수와 단원 수를 보면서 우선 검수 대상을 고를 수 있습니다.`}
    >
      <SectionCard>
        <View style={styles.toolbar}>
          <InfoChip label={modeLabel[selectedMode]} />
          <ActionButton label="카테고리" onPress={openCategory} variant="ghost" compact />
        </View>
        <Text style={styles.summaryHeadline}>
          {formatCount(summary.subjectCount)}과목 · {formatCount(summary.unitCount)}개 단원 ·{" "}
          {formatCount(summary.conceptCount)}개 개념
        </Text>
        <Text style={styles.summaryText}>
          검색 입력은 지연 반영으로 처리해서 과목 수가 커져도 바로 필터링되는 구조입니다.
        </Text>
        <FilterTabs
          options={filterOptions}
          activeId={subjectFilter}
          onChange={(value) => setSubjectFilter(value as SubjectFilter)}
        />
        <TextInput
          value={subjectSearch}
          onChangeText={setSubjectSearch}
          placeholder="과목 또는 태그 검색"
          placeholderTextColor={palette.muted}
          style={styles.searchInput}
        />
        <Text style={styles.summaryText}>
          현재 {subjects.length}개 과목이 조건에 맞습니다. 모든 과목은 다단원 구조로 바로 플레이할 수 있고, 출시 전 검수 대상 선별에도 바로 쓸 수 있습니다.
        </Text>
      </SectionCard>

      {subjects.map((subject) => {
        const progress = subjectProgress[subject.id];
        const masteryValues = Object.values(progress?.masteryByUnit ?? {});
        const averageMastery =
          masteryValues.length > 0
            ? Math.round(
                masteryValues.reduce((sum, value) => sum + value, 0) / masteryValues.length,
              )
            : 0;

        return (
          <Pressable
            key={subject.id}
            onPress={() => subject.isPlayable && selectSubject(subject.id)}
            disabled={!subject.isPlayable}
            style={[
              styles.subjectCard,
              !subject.isPlayable && styles.subjectCardDisabled,
            ]}
          >
            <View style={styles.subjectHeader}>
              <Text style={styles.subjectTitle}>{subject.name}</Text>
              <Text style={styles.subjectStatus}>
                {subject.isPlayable ? "플레이 가능" : "준비 중"}
              </Text>
            </View>
            <Text style={styles.subjectDescription}>{subject.headline}</Text>
            <View style={styles.chipRow}>
              <InfoChip label={`${formatCount(subject.unitIds.length)}개 단원`} />
              <InfoChip label={`${formatCount(subject.totalConcepts)}개 개념`} />
              <InfoChip
                label={
                  progress
                    ? `숙련도 ${averageMastery}%`
                    : "첫 플레이 추천"
                }
              />
            </View>
            <Text style={styles.subjectMeta}>
              태그: {subject.searchTags.join(" · ")} · 퀴즈 {formatCount(subject.totalQuizzes)}개
            </Text>
            <Text style={styles.progressMeta}>
              {progress
                ? `플레이 ${progress.sessions}회 · 학습 시간 ${formatStudyMinutes(progress.studySeconds)}`
                : `예상 전체 학습량 ${formatStudyMinutes(subject.estimatedMinutes * 60)}`}
            </Text>
          </Pressable>
        );
      })}

      {subjects.length === 0 ? (
        <SectionCard>
          <Text style={styles.subjectDescription}>
            현재 조건에 맞는 과목이 없습니다. 필터나 검색어를 바꿔 보세요.
          </Text>
        </SectionCard>
      ) : null}

      <ActionButton label="누적 통계 보기" onPress={openStats} variant="secondary" />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInput: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    color: palette.ink,
    fontSize: 15,
  },
  summaryHeadline: {
    fontSize: 22,
    lineHeight: 29,
    color: palette.ink,
    fontWeight: "800",
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
  subjectCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  subjectCardDisabled: {
    opacity: 0.58,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  subjectTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
  },
  subjectStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.accent,
  },
  subjectDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.ink,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subjectMeta: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
  progressMeta: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.ink,
  },
});

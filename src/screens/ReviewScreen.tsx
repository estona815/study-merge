import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { palette } from "../constants/theme";
import { getSubjectById } from "../data/subjectCatalog";
import { useAppStore } from "../store/useAppStore";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";

function takeUniqueItems(
  items: ReturnType<typeof useAppStore.getState>["reviewQueue"],
  seenIds: Set<string>,
  limit: number,
) {
  const selected: ReturnType<typeof useAppStore.getState>["reviewQueue"] = [];

  for (const item of items) {
    if (seenIds.has(item.id)) {
      continue;
    }

    seenIds.add(item.id);
    selected.push(item);

    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}

export function ReviewScreen() {
  const reviewQueue = useAppStore((state) => state.reviewQueue);
  const clearReviewItem = useAppStore((state) => state.clearReviewItem);
  const startReviewItem = useAppStore((state) => state.startReviewItem);
  const openCategory = useAppStore((state) => state.openCategory);
  const openStats = useAppStore((state) => state.openStats);

  const frequentWrong = useMemo(
    () =>
      [...reviewQueue]
        .sort((left, right) => right.incorrectCount - left.incorrectCount)
        .slice(0, 4),
    [reviewQueue],
  );
  const upcoming = useMemo(
    () =>
      [...reviewQueue]
        .sort((left, right) =>
          (left.nextReviewAt ?? "").localeCompare(right.nextReviewAt ?? ""),
        )
        .slice(0, 4),
    [reviewQueue],
  );
  const stale = useMemo(
    () =>
      [...reviewQueue]
        .sort((left, right) =>
          (left.lastReviewedAt ?? "").localeCompare(right.lastReviewedAt ?? ""),
        )
        .slice(0, 4),
    [reviewQueue],
  );
  const urgentCount = reviewQueue.filter((item) => item.reviewPriority >= 12).length;
  const heavyWrongCount = reviewQueue.filter((item) => item.incorrectCount >= 2).length;
  const seenIds = new Set<string>();
  const wrongBlockItems = takeUniqueItems(reviewQueue.slice(0, 5), seenIds, 5);
  const upcomingItems = takeUniqueItems(upcoming, seenIds, 4);
  const staleItems = takeUniqueItems(stale, seenIds, 4);
  const frequentWrongItems = takeUniqueItems(frequentWrong, seenIds, 4);

  return (
    <ScreenLayout
      title="약점 복구 큐"
      subtitle="오답과 취약 개념을 다시 연결하는 로컬 복습 모드입니다."
    >
      <SectionCard>
        <InfoChip label="복습 상태" />
        <View style={styles.metricsRow}>
          <Metric label="대기 블록" value={`${reviewQueue.length}개`} />
          <Metric label="긴급 복습" value={`${urgentCount}개`} />
          <Metric label="반복 오답" value={`${heavyWrongCount}개`} />
          <Metric label="오늘 추천" value={`${upcoming.length}개`} />
        </View>
      </SectionCard>

      {reviewQueue.length === 0 ? (
        <SectionCard>
          <InfoChip label="비어 있음" />
          <Text style={styles.bodyText}>
            아직 쌓인 오답 블록이 없습니다. 게임에서 틀린 문제는 여기에 자동으로
            저장됩니다.
          </Text>
        </SectionCard>
      ) : (
        <>
          <ReviewSection
            title="다시 연결할 개념"
            items={wrongBlockItems}
            onReplay={startReviewItem}
            onRemove={clearReviewItem}
          />
          <ReviewSection
            title="복습 예정 블록"
            items={upcomingItems}
            onReplay={startReviewItem}
            onRemove={clearReviewItem}
          />
          <ReviewSection
            title="오래 안 본 블록"
            items={staleItems}
            onReplay={startReviewItem}
            onRemove={clearReviewItem}
          />
          <ReviewSection
            title="자주 틀린 블록"
            items={frequentWrongItems}
            onReplay={startReviewItem}
            onRemove={clearReviewItem}
          />
        </>
      )}

      <View style={styles.row}>
        <ActionButton label="카테고리" onPress={openCategory} variant="ghost" compact />
        <ActionButton label="통계" onPress={openStats} variant="secondary" compact />
      </View>
    </ScreenLayout>
  );
}

function ReviewSection({
  title,
  items,
  onReplay,
  onRemove,
}: {
  title: string;
  items: ReturnType<typeof useAppStore.getState>["reviewQueue"];
  onReplay: (reviewId: string) => void;
  onRemove: (reviewId: string) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SectionCard>
      <InfoChip label={title} />
      {items.map((item) => {
        const subject = getSubjectById(item.subjectId);

        return (
          <View key={`${title}-${item.id}`} style={styles.sectionItem}>
            <Text style={styles.cardTitle}>{subject?.name ?? item.subjectId}</Text>
            <Text style={styles.bodyText}>{item.prompt}</Text>
            <Text style={styles.metaText}>원인 개념: {item.sourceTitles.join(" + ")}</Text>
            <Text style={styles.metaText}>
              오답 {item.incorrectCount}회 · 우선순위 {item.reviewPriority.toFixed(1)} · {item.nextReviewLabel}
            </Text>
            <Text style={styles.explanationText}>{item.explanation}</Text>
            <View style={styles.row}>
              <ActionButton label="약점 복구 플레이" onPress={() => onReplay(item.id)} compact />
              <ActionButton
                label="큐에서 정리"
                onPress={() => onRemove(item.id)}
                compact
                variant="ghost"
              />
            </View>
          </View>
        );
      })}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
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
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.muted,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: "800",
    color: palette.ink,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: palette.ink,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.ink,
  },
  metaText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.ink,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sectionItem: {
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
});

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

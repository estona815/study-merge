import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette } from "../constants/theme";
import { Difficulty, LearningGoal, TrackType } from "../types/models";
import { useAppStore } from "../store/useAppStore";
import { ActionButton, InfoChip, ScreenLayout, SectionCard } from "../components/ui";

const modeOptions: Array<{ id: TrackType; title: string; description: string }> = [
  {
    id: "highSchool",
    title: "고등학교",
    description: "한국사, 생명과학 같은 내신·수능 대비 과목으로 시작합니다.",
  },
  {
    id: "certification",
    title: "자격증",
    description: "산업안전기사, 정보처리기사 같은 암기형 자격 개념으로 시작합니다.",
  },
];

const goalOptions: Array<{ id: LearningGoal; title: string }> = [
  { id: "habit", title: "매일 3분 루틴" },
  { id: "mastery", title: "단원 완성" },
  { id: "exam", title: "시험 직전 암기" },
];

const difficultyOptions: Array<{ id: Difficulty; title: string }> = [
  { id: "easy", title: "쉬움" },
  { id: "normal", title: "보통" },
  { id: "hard", title: "어려움" },
  { id: "exam", title: "시험직전" },
];

export function OnboardingScreen() {
  const selectedMode = useAppStore((state) => state.selectedMode);
  const goal = useAppStore((state) => state.goal);
  const difficulty = useAppStore((state) => state.difficulty);
  const setMode = useAppStore((state) => state.setMode);
  const setGoal = useAppStore((state) => state.setGoal);
  const setDifficulty = useAppStore((state) => state.setDifficulty);
  const finishOnboarding = useAppStore((state) => state.finishOnboarding);

  return (
    <ScreenLayout
      title="Study Merge"
      subtitle="개념 블록을 밀고 합치며 퀴즈로 확인하는 암기형 학습 게임 MVP입니다."
    >
      <SectionCard>
        <InfoChip label="앱 목표" />
        <Text style={styles.bodyText}>
          문제집처럼 넘기는 대신, 관련 개념을 직접 합성하면서 약한 개념을
          반복 복습하도록 설계했습니다.
        </Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>1. 학습 트랙 선택</Text>
        <View style={styles.stack}>
          {modeOptions.map((option) => (
            <SelectableCard
              key={option.id}
              selected={selectedMode === option.id}
              title={option.title}
              description={option.description}
              onPress={() => setMode(option.id)}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>2. 목표 선택</Text>
        <View style={styles.inlineWrap}>
          {goalOptions.map((option) => (
            <ChipButton
              key={option.id}
              label={option.title}
              selected={goal === option.id}
              onPress={() => setGoal(option.id)}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>3. 난이도 선택</Text>
        <View style={styles.inlineWrap}>
          {difficultyOptions.map((option) => (
            <ChipButton
              key={option.id}
              label={option.title}
              selected={difficulty === option.id}
              onPress={() => setDifficulty(option.id)}
            />
          ))}
        </View>
        <Text style={styles.caption}>
          쉬움은 힌트를 보여 주고, 어려움은 5x5 보드와 오답 유도 블록이 섞일 수
          있습니다.
        </Text>
      </SectionCard>

      <ActionButton label="MVP 시작하기" onPress={finishOnboarding} />
    </ScreenLayout>
  );
}

function SelectableCard({
  selected,
  title,
  description,
  onPress,
}: {
  selected: boolean;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choiceCard, selected && styles.choiceCardSelected]}
    >
      <Text style={styles.choiceTitle}>{title}</Text>
      <Text style={styles.choiceDescription}>{description}</Text>
    </Pressable>
  );
}

function ChipButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chipButton, selected && styles.chipButtonSelected]}
    >
      <Text style={[styles.chipButtonText, selected && styles.chipButtonTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: palette.ink,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
  },
  stack: {
    gap: 10,
  },
  choiceCard: {
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  choiceCardSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.accentSoft,
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.ink,
  },
  choiceDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.muted,
  },
  inlineWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipButtonSelected: {
    backgroundColor: palette.tealSoft,
    borderColor: palette.teal,
  },
  chipButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.ink,
  },
  chipButtonTextSelected: {
    color: palette.teal,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
});

import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { palette } from "../constants/theme";
import { Quiz, QuizResponse } from "../types/models";
import { ActionButton, SectionCard } from "./ui";

interface QuizCardProps {
  quiz: Quiz;
  onSubmit: (response: QuizResponse) => void;
  feedback?: {
    isCorrect: boolean;
  } | null;
  onContinue?: () => void;
}

export function QuizCard({ quiz, onSubmit, feedback, onContinue }: QuizCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState("");
  const [matchingAnswer, setMatchingAnswer] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedChoice("");
    setTextAnswer("");
    setMatchingAnswer({});
  }, [quiz.id]);

  const canSubmit =
    quiz.type === "ox"
      ? selectedChoice !== ""
      : quiz.type === "multipleChoice"
        ? selectedChoice !== ""
        : quiz.type === "fillBlank"
          ? textAnswer.trim().length > 0
          : quiz.pairs.every((pair) => Boolean(matchingAnswer[pair.left]));
  const isLocked = Boolean(feedback);

  return (
    <SectionCard>
      <Text style={styles.badge}>합성 확인 퀴즈</Text>
      <Text style={styles.prompt}>{quiz.prompt}</Text>

      {feedback ? (
        <View style={[styles.feedbackCard, feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <Text style={styles.feedbackTitle}>
            {feedback.isCorrect ? "정답입니다" : "오답입니다"}
          </Text>
          <Text style={styles.feedbackText}>{quiz.explanation}</Text>
        </View>
      ) : null}

      {quiz.type === "ox" ? (
        <View style={styles.choiceRow}>
          {[
            { label: "O", value: "true" },
            { label: "X", value: "false" },
          ].map((choice) => (
            <ChoiceButton
              key={choice.value}
              label={choice.label}
              selected={selectedChoice === choice.value}
              disabled={isLocked}
              onPress={() => setSelectedChoice(choice.value)}
            />
          ))}
        </View>
      ) : null}

      {quiz.type === "multipleChoice" ? (
        <View style={styles.column}>
          {quiz.options.map((option) => (
            <ChoiceButton
              key={option.id}
              label={option.text}
              selected={selectedChoice === option.id}
              disabled={isLocked}
              onPress={() => setSelectedChoice(option.id)}
            />
          ))}
        </View>
      ) : null}

      {quiz.type === "fillBlank" ? (
        <TextInput
          value={textAnswer}
          onChangeText={setTextAnswer}
          placeholder={quiz.placeholder}
          placeholderTextColor={palette.muted}
          style={styles.input}
          autoCapitalize="none"
          editable={!isLocked}
        />
      ) : null}

      {quiz.type === "matching" ? (
        <View style={styles.column}>
          {quiz.pairs.map((pair) => (
            <View key={pair.left} style={styles.matchingBlock}>
              <Text style={styles.matchingLabel}>{pair.left}</Text>
              <View style={styles.choiceWrap}>
                {quiz.choices.map((choice) => (
                  <ChoiceButton
                    key={`${pair.left}-${choice}`}
                    label={choice}
                    selected={matchingAnswer[pair.left] === choice}
                    disabled={isLocked}
                    onPress={() =>
                      setMatchingAnswer((current) => ({
                        ...current,
                        [pair.left]: choice,
                      }))
                    }
                    compact
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <ActionButton
        label={
          feedback
            ? feedback.isCorrect
              ? "학습 확정 완료"
              : "다시 연결할 개념으로 저장"
            : "학습 확정하기"
        }
        disabled={feedback ? false : !canSubmit}
        onPress={() => {
          if (feedback) {
            onContinue?.();
            return;
          }

          if (quiz.type === "ox") {
            onSubmit(selectedChoice === "true");
            return;
          }

          if (quiz.type === "multipleChoice") {
            onSubmit(selectedChoice);
            return;
          }

          if (quiz.type === "fillBlank") {
            onSubmit(textAnswer);
            return;
          }

          onSubmit(matchingAnswer);
        }}
      />
      <Text style={styles.helpText}>
        {feedback
          ? "결과를 확인했으면 다음 턴으로 이어가세요."
          : "정답 확인 후 짧은 해설과 약점 복구 반영 결과가 표시됩니다."}
      </Text>
    </SectionCard>
  );
}

function ChoiceButton({
  label,
  selected,
  disabled,
  onPress,
  compact = false,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.choiceButton,
        selected && styles.choiceSelected,
        compact && styles.choiceCompact,
        disabled && styles.choiceDisabled,
      ]}
    >
      <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "800",
    color: palette.accent,
  },
  prompt: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
    lineHeight: 24,
  },
  feedbackCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
  },
  feedbackCorrect: {
    backgroundColor: "#edf8f1",
    borderColor: "#8fd0ac",
  },
  feedbackWrong: {
    backgroundColor: "#fff1ef",
    borderColor: "#efaaa4",
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.ink,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.ink,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    gap: 10,
  },
  choiceWrap: {
    gap: 8,
  },
  choiceButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#fff",
  },
  choiceCompact: {
    paddingVertical: 10,
  },
  choiceDisabled: {
    opacity: 0.56,
  },
  choiceSelected: {
    backgroundColor: palette.tealSoft,
    borderColor: palette.teal,
  },
  choiceText: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "600",
  },
  choiceTextSelected: {
    color: palette.teal,
  },
  input: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    color: palette.ink,
    fontSize: 15,
  },
  matchingBlock: {
    gap: 8,
  },
  matchingLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: palette.ink,
  },
  helpText: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
});

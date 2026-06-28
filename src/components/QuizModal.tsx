import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { palette } from "../constants/theme";
import { Quiz, QuizResponse } from "../types/models";
import { QuizCard } from "./QuizCard";

export function QuizModal({
  visible,
  quiz,
  onClose,
  onSubmit,
  dismissible = true,
  feedback,
  onContinue,
}: {
  visible: boolean;
  quiz?: Quiz;
  onClose: () => void;
  onSubmit: (response: QuizResponse) => void;
  dismissible?: boolean;
  feedback?: {
    isCorrect: boolean;
  } | null;
  onContinue?: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {dismissible ? (
          <Pressable style={styles.dismissLayer} onPress={onClose} />
        ) : (
          <View style={styles.dismissLayer} />
        )}
        <View style={styles.sheet}>
          <Text style={styles.header}>학습 확정</Text>
          {!dismissible ? (
            <Text style={styles.caption}>
              {feedback
                ? "결과를 확인하면 다음 개념 합성으로 이어집니다."
                : "정답을 제출하면 이번 개념 합성이 학습으로 확정됩니다."}
            </Text>
          ) : null}
          {quiz ? (
            <QuizCard
              quiz={quiz}
              onSubmit={onSubmit}
              feedback={feedback}
              onContinue={onContinue}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(31, 41, 55, 0.32)",
    justifyContent: "flex-end",
  },
  dismissLayer: {
    flex: 1,
  },
  sheet: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: palette.background,
    gap: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
});

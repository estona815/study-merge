import React, { useMemo, useRef } from "react";
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { blockColors, palette } from "../constants/theme";
import { BoardCell, Direction } from "../types/models";

interface BoardViewProps {
  board: BoardCell[];
  boardSize: number;
  disabled?: boolean;
  onMove: (direction: Direction) => void;
}

const moveLabels: Array<{ direction: Direction; label: string }> = [
  { direction: "up", label: "↑" },
  { direction: "left", label: "←" },
  { direction: "down", label: "↓" },
  { direction: "right", label: "→" },
];

export function BoardView({
  board,
  boardSize,
  disabled = false,
  onMove,
}: BoardViewProps) {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 14 || Math.abs(gestureState.dy) > 14,
      onPanResponderRelease: (_, gestureState) => {
        if (disabled) {
          return;
        }

        const { dx, dy } = gestureState;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) {
          return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
          onMove(dx > 0 ? "right" : "left");
          return;
        }

        onMove(dy > 0 ? "down" : "up");
      },
    }),
  ).current;

  const rows = useMemo(() => {
    return Array.from({ length: boardSize }, (_, rowIndex) =>
      board.slice(rowIndex * boardSize, rowIndex * boardSize + boardSize),
    );
  }, [board, boardSize]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.board} {...panResponder.panHandlers}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <View key={`cell-${rowIndex}-${columnIndex}`} style={styles.cell}>
                {cell ? (
                  <View
                    style={[
                      styles.tile,
                      {
                        backgroundColor: blockColors[cell.blockType],
                        borderColor: cell.isTrap ? palette.danger : palette.border,
                      },
                    ]}
                  >
                    <View style={styles.tileMetaRow}>
                      <Text
                        style={[
                          styles.tileMetaBadge,
                          cell.isTrap ? styles.tileMetaBadgeDanger : styles.tileMetaBadgeNeutral,
                        ]}
                      >
                        {cell.isTrap ? "함정" : cell.stage > 0 ? "합성" : "기초"}
                      </Text>
                    </View>
                    <Text style={styles.tileLabel} numberOfLines={3}>
                      {cell.title}
                    </Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.controls}>
        {moveLabels.map((item) => (
          <Pressable
            key={item.direction}
            onPress={() => onMove(item.direction)}
            style={[styles.controlButton, disabled && styles.controlDisabled]}
            disabled={disabled}
          >
            <Text style={styles.controlLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
    width: "100%",
    alignSelf: "center",
  },
  board: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    borderRadius: 28,
    backgroundColor: "#f2e4cf",
    padding: 10,
    gap: 8,
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  cell: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.34)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  tile: {
    flex: 1,
    width: "100%",
    padding: 8,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
  },
  tileMetaRow: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
  },
  tileMetaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "800",
    overflow: "hidden",
  },
  tileMetaBadgeNeutral: {
    backgroundColor: "rgba(255,255,255,0.74)",
    color: palette.ink,
  },
  tileMetaBadgeDanger: {
    backgroundColor: "rgba(189, 79, 75, 0.18)",
    color: palette.danger,
  },
  tileLabel: {
    textAlign: "center",
    color: palette.ink,
    fontWeight: "800",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 18,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  controlButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  controlDisabled: {
    opacity: 0.35,
  },
  controlLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.ink,
  },
});

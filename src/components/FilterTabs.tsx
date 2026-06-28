import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette } from "../constants/theme";

interface FilterOption {
  id: string;
  label: string;
}

export function FilterTabs({
  options,
  activeId,
  onChange,
}: {
  options: FilterOption[];
  activeId: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = option.id === activeId;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
  },
  tabActive: {
    backgroundColor: palette.accentSoft,
    borderColor: palette.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.ink,
  },
  tabTextActive: {
    color: palette.accent,
  },
});

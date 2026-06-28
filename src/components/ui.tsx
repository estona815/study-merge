import React, { ReactNode } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { palette } from "../constants/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  compact?: boolean;
  disabled?: boolean;
}

interface ScreenLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  scroll?: boolean;
}

export function ScreenLayout({
  title,
  subtitle,
  children,
  scroll = true,
}: ScreenLayoutProps) {
  const content = (
    <View style={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function SectionCard({ children }: { children: ReactNode }) {
  return <View style={styles.sectionCard}>{children}</View>;
}

export function InfoChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  compact = false,
  disabled = false,
}: ActionButtonProps) {
  const variantStyle =
    variant === "primary"
      ? styles.primaryButton
      : variant === "secondary"
        ? styles.secondaryButton
        : variant === "danger"
          ? styles.dangerButton
          : styles.ghostButton;

  const textStyle =
    variant === "ghost" ? styles.ghostButtonText : styles.solidButtonText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variantStyle,
        compact && styles.compactButton,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 16,
  },
  heroCard: {
    padding: 22,
    borderRadius: 30,
    backgroundColor: "rgba(255, 250, 242, 0.96)",
    borderWidth: 1,
    borderColor: palette.border,
    ...(Platform.OS === "web"
      ? { boxShadow: `0px 20px 48px ${palette.shadow}` }
      : {
          shadowColor: palette.ink,
          shadowOpacity: 0.1,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
          elevation: 6,
        }),
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: palette.ink,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: palette.muted,
  },
  sectionCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    ...(Platform.OS === "web"
      ? { boxShadow: `0px 12px 32px ${palette.shadow}` }
      : {
          shadowColor: palette.ink,
          shadowOpacity: 0.06,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 3,
        }),
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: palette.tealSoft,
    borderWidth: 1,
    borderColor: "rgba(45, 148, 139, 0.18)",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.teal,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  compactButton: {
    minHeight: 40,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  primaryButton: {
    backgroundColor: palette.accent,
    ...(Platform.OS === "web"
      ? { boxShadow: `0px 12px 24px rgba(240, 106, 36, 0.22)` }
      : {}),
  },
  secondaryButton: {
    backgroundColor: palette.teal,
    ...(Platform.OS === "web"
      ? { boxShadow: `0px 12px 24px rgba(45, 148, 139, 0.2)` }
      : {}),
  },
  dangerButton: {
    backgroundColor: palette.danger,
  },
  ghostButton: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: palette.border,
  },
  solidButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  ghostButtonText: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  orbTop: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: palette.accentSoft,
    top: -120,
    right: -30,
    opacity: 0.52,
  },
  orbBottom: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: palette.tealSoft,
    bottom: -110,
    left: -90,
    opacity: 0.58,
  },
});

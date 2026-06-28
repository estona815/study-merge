import { BlockType } from "../types/models";

export const palette = {
  background: "#f6efe5",
  surface: "#fffaf2",
  surfaceMuted: "#f9f1e5",
  ink: "#182235",
  muted: "#667085",
  accent: "#f06a24",
  accentSoft: "#ffd7bd",
  teal: "#2d948b",
  tealSoft: "#d4f0e9",
  gold: "#d2a24a",
  lavender: "#d9cff6",
  border: "#eadbca",
  success: "#2d8a56",
  danger: "#bd4f4b",
  shadow: "rgba(24, 34, 53, 0.12)",
};

export const blockColors: Record<BlockType, string> = {
  term: "#f2d3aa",
  definition: "#f9e2c7",
  formula: "#d6e6ff",
  law: "#f8c9a8",
  date: "#c4d7f2",
  person: "#f6d8de",
  event: "#dcead0",
  cause: "#f0cfbc",
  result: "#c8ecd9",
  example: "#ebe0ff",
  classification: "#d5ece7",
  process: "#d8e9ff",
  risk: "#f5c2bc",
  symptom: "#f7d9b2",
  principle: "#c3ead9",
  pair: "#e9d7ff",
  quiz: "#d7e8ff",
  trap: "#e4d7ff",
};

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatStudyMinutes(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}초`;
  }

  const minutes = Math.round(seconds / 60);
  return `${minutes}분`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

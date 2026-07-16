export const QUICK_FOODS = ["치킨", "떡볶이", "라면", "야식"];

export const CRAVING_OPTIONS = [
  {
    id: "delay",
    icon: "clock",
    accent: "pink",
    title: "5분만 미루기",
    detail: "타이머가 끝난 뒤 다시 고를 수 있어요.",
  },
  {
    id: "swap",
    icon: "sparkle",
    accent: "lilac",
    title: "다른 행동 고르기",
    detail: "주문 전에 짧은 행동 하나를 정해요.",
  },
  {
    id: "plan",
    icon: "calendar",
    accent: "ice",
    title: "다시 볼 시간 정하기",
    detail: "언제 다시 결정할지 직접 정해요.",
  },
];

export const RESET_ACTIONS = [
  { id: "music", icon: "music", title: "좋아하는 노래 한 곡 듣기" },
  { id: "window", icon: "moon", title: "창가에서 잠깐 쉬기" },
  { id: "pause", icon: "sparkle", title: "화면을 닫고 다른 일 해보기" },
];

export const PLAN_TIMES = [
  { id: "ten", label: "10분 뒤 다시 보기" },
  { id: "thirty", label: "30분 뒤 다시 보기" },
  { id: "tomorrow", label: "오늘은 닫아두기" },
];

export function normalizeFood(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 24);
}

export function canStartCravingGate({ adultConfirmed, food }) {
  return adultConfirmed && normalizeFood(food).length > 0;
}

export function nextScreenForOption(optionId) {
  return {
    delay: "timer",
    swap: "swap",
    plan: "plan",
  }[optionId] ?? "options";
}

export function isValidDetailSelection(optionId, value) {
  if (optionId === "swap") return RESET_ACTIONS.some((item) => item.id === value);
  if (optionId === "plan") return PLAN_TIMES.some((item) => item.id === value);
  return optionId === "delay" && value === "timer";
}

export function formatCountdown(value) {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

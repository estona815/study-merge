export interface CravingOption {
  id: "delay" | "swap" | "plan";
  emoji: string;
  title: string;
  detail: string;
}

export const QUICK_FOODS: string[];
export const CRAVING_OPTIONS: CravingOption[];
export function normalizeFood(value: string): string;
export function canStartCravingGate(input: { adultConfirmed: boolean; food: string }): boolean;
export function nextScreenForOption(optionId: string): "timer" | "complete";

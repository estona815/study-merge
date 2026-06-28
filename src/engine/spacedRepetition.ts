function daysSince(date?: string, now = new Date()): number {
  if (!date) {
    return 7;
  }

  const diff = now.getTime() - new Date(date).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

export function calculateReviewPriority(params: {
  wrongCount: number;
  mastery: number;
  examImportance: number;
  lastReviewedAt?: string;
  now?: Date;
}): number {
  const staleDays = daysSince(params.lastReviewedAt, params.now);
  return (
    params.wrongCount * 3 +
    staleDays +
    (100 - params.mastery) / 10 +
    params.examImportance * 2
  );
}

export function getReviewLabel(priority: number, wrongCount: number): string {
  if (wrongCount >= 3 || priority >= 18) {
    return "시험 전 집중 복습";
  }

  if (wrongCount >= 2 || priority >= 12) {
    return "오늘 저녁 다시 보기";
  }

  return "오늘 다시 보기";
}

export function getNextReviewAt(priority: number, now = new Date()): string {
  const hours =
    priority >= 18 ? 2 :
    priority >= 12 ? 8 :
    24;
  return new Date(now.getTime() + hours * 3600000).toISOString();
}

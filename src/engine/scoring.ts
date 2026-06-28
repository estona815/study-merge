export function calculateMergeScore(params: {
  combo: number;
  conceptDifficulty: number;
  isCorrect: boolean;
  isTrap?: boolean;
}): number {
  if (!params.isCorrect) {
    return 0;
  }

  const baseMerge = 10;
  const quizBonus = 50;
  const comboBonus = Math.max(params.combo, 0) * 10;
  const difficultyBonus = Math.max(params.conceptDifficulty, 1) * 15;
  const trapPenalty = params.isTrap ? 20 : 0;

  return baseMerge + quizBonus + comboBonus + difficultyBonus - trapPenalty;
}

export function calculateUnitClearBonus(wrongAnswers: number): number {
  return wrongAnswers === 0 ? 300 : 180;
}

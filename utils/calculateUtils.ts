// 少数第二位までを返す
export function calculateCorrectRate(
  totalCount: number,
  correctCount: number
): number {
  const rate = correctCount / totalCount
  const roundedRate = Math.round(rate * 100) / 100
  return roundedRate
}

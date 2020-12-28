import Result from "./result"

function createResult(correctAnswerIndex: number[], answerIndex: number[]) {
  return new Result(
    {
      id: 0,
      sectionId: 0,
      question: "",
      explanation: "",
      answers: [],
      correctAnswerIndex: correctAnswerIndex,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    answerIndex
  )
}

describe("Result", () => {
  it("正解判定が正しく動作する", () => {
    expect(createResult([0], [0]).isCorrect).toBe(true)
    expect(createResult([0, 1], [0, 1]).isCorrect).toBe(true)
    expect(createResult([0], [1]).isCorrect).toBe(false)
    expect(createResult([0], [0, 1]).isCorrect).toBe(false)
    expect(createResult([0], []).isCorrect).toBe(false)
    expect(createResult([0, 1], [0]).isCorrect).toBe(false)
  })
})

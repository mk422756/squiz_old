import Result from "./result"
import Results from "./results"

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

describe("Results", () => {
  it("正解判定が正しく動作する", () => {
    const results100 = new Results([
      createResult([0], [0]),
      createResult([0], [0]),
      createResult([0], [0]),
    ])

    const results067 = new Results([
      createResult([0], [0]),
      createResult([0], [0]),
      createResult([0], [1]),
    ])

    const results033 = new Results([
      createResult([0], [0]),
      createResult([0], [1]),
      createResult([0], [1]),
    ])

    expect(results100.correctRate).toBe(1)
    expect(results067.correctRate).toBe(0.67)
    expect(results033.correctRate).toBe(0.33)
  })

  it("プロパティが適切に動く", () => {
    const results100 = new Results([
      createResult([0], [0]),
      createResult([0], [0]),
      createResult([0], [0]),
    ])

    const results067 = new Results([
      createResult([0], [0]),
      createResult([0], [0]),
      createResult([0], [1]),
    ])

    const results033 = new Results([
      createResult([0], [0]),
      createResult([0], [1]),
      createResult([0], [1]),
    ])

    const results0 = new Results([
      createResult([0], [1]),
      createResult([0], [1]),
      createResult([0], [1]),
    ])

    expect(results100.correctCount).toBe(3)
    expect(results067.correctCount).toBe(2)
    expect(results033.correctCount).toBe(1)
    expect(results0.correctCount).toBe(0)

    expect(results100.incorrectCount).toBe(0)
    expect(results067.incorrectCount).toBe(1)
    expect(results033.incorrectCount).toBe(2)
    expect(results0.incorrectCount).toBe(3)

    expect(results100.length).toBe(3)
    expect(results067.length).toBe(3)
    expect(results033.length).toBe(3)
    expect(results0.length).toBe(3)
  })
})

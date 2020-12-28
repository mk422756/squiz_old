import {Quiz} from 'models/quiz'

export default class Result {
  readonly quiz: Quiz
  readonly answerIndex: number[]

  constructor(quiz: Quiz, answerIndex: number[]) {
    this.quiz = quiz
    this.answerIndex = answerIndex
  }

  get isCorrect() {
    return (
      this.answerIndex.length === this.quiz.correctAnswerIndex.length &&
      this.answerIndex.every(
        (value, index) => value === this.quiz.correctAnswerIndex[index]
      )
    )
  }
}

import {Quiz} from './quiz'

export type History = {
  id: string
  collectionId: string
  collectionTitle: string
  sectionId: string
  sectionTitle: string
  userId: string
  quizCount: number
  correctCount: number
  incorrectCount: number
  createdAt: Date
  updatedAt: Date
}

export type HistoryDetail = {
  quizId: string
  question: string
  answers: string[]
  correctAnswerIndex: number[]
  answerIndex: number[]
  explanation: string
  type: string
}

export class HistoryDetails {
  readonly history: History
  readonly details: HistoryDetail[]

  constructor(history: History, details: HistoryDetail[]) {
    this.history = history
    this.details = details
  }

  toQuizzes(onlyIncorrect: boolean = false): Quiz[] {
    const details = onlyIncorrect
      ? this.details.filter((detail) => {
          return !(
            detail.answerIndex.length === detail.correctAnswerIndex.length &&
            detail.answerIndex.every(
              (value, index) => value === detail.correctAnswerIndex[index]
            )
          )
        })
      : this.details

    return details.map((detail) => {
      // 暫定でQuizオブジェクトを作成する
      return {
        id: detail.quizId,
        question: detail.question,
        answers: detail.answers || [],
        correctAnswerIndex: detail.correctAnswerIndex || [],
        explanation: detail.explanation || '',
        type: detail.type || '',
        collectionId: this.history.collectionId,
        sectionId: this.history.sectionId,
        creatorId: '',
        createdAt: this.history.createdAt || new Date(),
        updatedAt: this.history.updatedAt || new Date(),
      }
    })
  }
}

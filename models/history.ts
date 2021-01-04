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
  question: string
  answers: string[]
  correctAnswerIndex: number[]
  answerIndex: number[]
  explanation: string
  type: string
}

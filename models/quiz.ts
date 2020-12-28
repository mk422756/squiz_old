export type Quiz = {
  id: string
  question: string
  answers: string[]
  correctAnswerIndex: number[]
  explanation: string
  type: string
  collectionId: string
  sectionId: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
}

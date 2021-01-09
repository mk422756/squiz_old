export type Collection = {
  id: string
  title: string
  description: string
  isPublic: boolean
  creatorId: string
  tags: string[]
  imageUrl: string
  quizCount: number
  createdAt: Date
  updatedAt: Date
}

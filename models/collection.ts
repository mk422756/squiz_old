export type Collection = {
  id: string
  title: string
  description: string
  isPublic: boolean
  needPayment: boolean
  price: number
  creatorId: string
  tags: string[]
  imageUrl: string
  quizCount: number
  createdAt: Date
  updatedAt: Date
}

export type PurchasedCollection = {
  collection: Collection
  purchasedAt: Date
}

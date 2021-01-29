import {useState, useEffect} from 'react'
import {getCollection, getPurchasedCollections} from 'clients/collection'
import {Collection, PurchasedCollection} from 'models/collection'

export function useCollection(id: string) {
  const [collection, setCollection] = useState<Collection>({
    id: '',
    title: '',
    description: '',
    isPublic: false,
    imageUrl: '',
    creatorId: '',
    tags: [],
    quizCount: 0,
    needPayment: false,
    price: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const collection = await getCollection(id)
      if (!unmounted) {
        setCollection(collection)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [id])

  return collection
}

export function usePurchasedCollections(userId: string) {
  const [collections, setCollections] = useState<PurchasedCollection[]>([])
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const collections = await getPurchasedCollections(userId)
      if (!unmounted) {
        setCollections(collections)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userId])

  return collections
}

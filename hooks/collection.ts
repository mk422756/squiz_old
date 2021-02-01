import {useState, useEffect} from 'react'
import {
  getCollection,
  getCollections,
  getCollectionsByUserId,
  getPurchasedCollections,
} from 'clients/collection'
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
      if (!unmounted && collection) {
        setCollection(collection)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [id])

  return collection
}

export function useCollections() {
  // TODO ページネーション
  const [collections, setCollections] = useState<Collection[]>([])
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const collections = await getCollections()
      if (!unmounted && collections) {
        setCollections(collections)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [])

  return collections
}

// TODO 一本化する
export function useCollectionsByUserId(userId: string) {
  // TODO ページネーション
  const [collections, setCollections] = useState<Collection[]>([])
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const collections = await getCollectionsByUserId(userId)
      if (!unmounted && collections) {
        setCollections(collections)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userId])

  return collections
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

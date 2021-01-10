import {useState, useEffect} from 'react'
import {getCollection} from 'clients/collection'
import {Collection} from 'models/collection'

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
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
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

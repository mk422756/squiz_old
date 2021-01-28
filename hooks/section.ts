import {useState, useEffect} from 'react'
import {getSection} from 'clients/section'
import {Section} from 'models/section'

export function useSection(collectionId: string, sectionId: string) {
  const [section, setSection] = useState<Section>({
    id: '',
    title: '',
    collectionId: '',
    creatorId: '',
    quizCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      if (!collectionId || !sectionId) {
        return
      }
      const section = await getSection(collectionId, sectionId)
      if (!unmounted) {
        setSection(section)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collectionId, sectionId])

  return section
}

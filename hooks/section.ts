import {useState, useEffect} from 'react'
import {getSection, getSections} from 'clients/section'
import {Section} from 'models/section'

export function useSection(collectionId: string, sectionId: string) {
  const [section, setSection] = useState<Section>({
    id: '',
    title: '',
    isFree: false,
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
      if (!unmounted && section) {
        setSection(section)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collectionId, sectionId])

  return section
}

export interface Functions {
  reloadSections: (collectionId: string) => void
}

export function useSections(
  collectionId: string
): [Section[], (collectionId: string) => void] {
  const [sections, setSections] = useState<Section[]>([])
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const sections = await getSections(collectionId)
      if (!unmounted) {
        setSections(sections)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collectionId])

  const reloadSections = async () => {
    const sections = await getSections(collectionId)
    setSections(sections)
  }

  return [sections, reloadSections]
}

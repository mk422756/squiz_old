import {useState, useEffect} from 'react'
import {getQuiz} from 'clients/quiz'
import {Quiz} from 'models/quiz'

export function useQuiz(collectionId: string, sectionId: string, id: string) {
  const [quiz, setQuiz] = useState<Quiz>({
    id,
    sectionId,
    collectionId,
    creatorId: '',
    answers: [],
    correctAnswerIndex: [],
    explanation: '',
    question: '',
    type: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      if (!collectionId || !sectionId || !id) {
        return
      }
      const quiz = await getQuiz(collectionId, sectionId, id)
      if (!unmounted) {
        setQuiz(quiz)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collectionId, sectionId, id])

  return quiz
}

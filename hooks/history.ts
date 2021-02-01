import {useState, useEffect} from 'react'
import {getHistoriesByUserId, getHistory} from 'clients/history'
import {History} from 'models/history'
import {Quiz} from 'models/quiz'

export function useHistories(userId: string) {
  // TODO ページネーション
  const [histries, setHistories] = useState<History[]>([])
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const histries = await getHistoriesByUserId(userId)
      if (!unmounted) {
        setHistories(histries)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userId])

  return histries
}

export function useHistory(
  userId: string,
  historyId: string,
  onlyIncorrect: boolean
): [History, Quiz[]] {
  const [history, setHistory] = useState<History>({
    userId: '',
    collectionId: '',
    collectionTitle: '',
    correctCount: 0,
    id: '',
    incorrectCount: 0,
    quizCount: 0,
    sectionId: '',
    sectionTitle: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const history = await getHistory(userId, historyId)
      if (!unmounted && history) {
        setHistory(history.history)
        setQuizzes(history.toQuizzes(onlyIncorrect))
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userId])

  return [history, quizzes]
}

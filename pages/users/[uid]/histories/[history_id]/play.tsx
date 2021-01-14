import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import LayoutQuiz from 'layouts/layout_quiz'
import StatusBox from 'components/quiz/StatusBox'
import ControlBox from 'components/quiz/ControlBox'
import PlayBox from 'components/quiz/PlayBox'
import ResultBox from 'components/quiz/ResultBox'
import Result from 'models/result'
import Results from 'models/results'
import {getHistory} from 'clients/history'
import {addRecord} from 'clients/record'
import {connect} from 'react-redux'

function PlayPage({userState}) {
  const [history, setHistory] = useState({} as any)
  const [quizzes, setQuizzes] = useState([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  const [results, setResults] = useState<Results>(new Results([]))
  const router = useRouter()

  const onlyIncorrect = router.query.only_incorrect === 'true'
  const {uid, history_id} = router.query
  const currentQuiz = quizzes[currentQuizIndex]

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      if (!uid || !history_id) {
        return
      }
      const history = await getHistory(uid as string, history_id as string)
      if (!unmounted) {
        setHistory(history.history)
        setQuizzes(history.toQuizzes(onlyIncorrect))
      }
    })()

    return () => {
      unmounted = true
    }
  }, [uid, history_id])

  const answer = () => {
    setIsAnswered(true)
    const result = new Result(currentQuiz, [selectedAnswerIndex])
    setIsCorrectAnswer(result.isCorrect)
    setResults(results.push(result))
    if (userState.isLogin) {
      addRecord(userState.uid, result.isCorrect)
    }
  }

  const next = () => {
    setIsAnswered(false)
    setCurrentQuizIndex(currentQuizIndex + 1)
    setSelectedAnswerIndex(0)
  }

  const finish = () => {
    setIsFinished(true)
  }

  const backToHistoriesPage = () => {
    router.push(`/users/${history.userId}/histories`)
  }

  return (
    <LayoutQuiz>
      <main className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          <StatusBox
            quizzes={quizzes}
            collectionTitle={history.collectionTitle || ''}
            sectionTitle={history.sectionTitle || ''}
            currentQuizIndex={currentQuizIndex}
            isFinished={isFinished}
            back={backToHistoriesPage}
          ></StatusBox>

          {!isFinished ? (
            <PlayBox
              quizzes={quizzes}
              finish={finish}
              isAnswered={isAnswered}
              selectedAnswerIndex={selectedAnswerIndex}
              isCorrectAnswer={isCorrectAnswer}
              currentQuizIndex={currentQuizIndex}
              setSelectedAnswerIndex={setSelectedAnswerIndex}
            ></PlayBox>
          ) : (
            <ResultBox
              results={results}
              collectionId={history.collectionId}
              quizCount={quizzes.length}
            ></ResultBox>
          )}
        </div>
        <div className="">
          <ControlBox
            quizzes={quizzes}
            currentQuizIndex={currentQuizIndex}
            isAnswered={isAnswered}
            isFinished={isFinished}
            isHistoryMode={true}
            answer={answer}
            next={next}
            finish={finish}
            back={backToHistoriesPage}
          ></ControlBox>
        </div>
      </main>
    </LayoutQuiz>
  )
}

const mapStateToProps = (state) => {
  return {userState: state}
}

export default connect(mapStateToProps)(PlayPage)

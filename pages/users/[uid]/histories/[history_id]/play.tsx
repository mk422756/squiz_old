import {useState} from 'react'
import {useRouter} from 'next/router'
import LayoutQuiz from 'layouts/layout_quiz'
import StatusBox from 'components/quiz/StatusBox'
import ControlBox from 'components/quiz/ControlBox'
import PlayBox from 'components/quiz/PlayBox'
import ResultBox from 'components/quiz/ResultBox'
import Result from 'models/result'
import Results from 'models/results'
import {addRecord} from 'clients/record'
import disableBrowserBackButton from 'disable-browser-back-navigation'
import {useRecoilValue} from 'recoil'
import {userState, userIsLoginState} from 'store/userState'
import {isBrowser} from 'utils/browser'
import {useHistory} from 'hooks/history'

export default function PlayPage() {
  if (isBrowser()) {
    disableBrowserBackButton()
  }
  const user = useRecoilValue(userState)
  const isLogin = useRecoilValue(userIsLoginState)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  const [results, setResults] = useState<Results>(new Results([]))
  const router = useRouter()

  const onlyIncorrect = router.query.only_incorrect === 'true'
  const {uid, history_id} = router.query
  const [history, quizzes] = useHistory(
    uid as string,
    history_id as string,
    onlyIncorrect
  )
  const currentQuiz = quizzes[currentQuizIndex]

  const answer = () => {
    setIsAnswered(true)
    const result = new Result(currentQuiz, [selectedAnswerIndex])
    setIsCorrectAnswer(result.isCorrect)
    setResults(results.push(result))
    if (isLogin && user) {
      addRecord(user.id, result.isCorrect)
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

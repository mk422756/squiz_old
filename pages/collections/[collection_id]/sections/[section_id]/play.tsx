import {useState} from 'react'
import {useRouter} from 'next/router'
import LayoutQuiz from 'layouts/layout_quiz'
import {createHistory} from 'clients/history'
import {addRecord} from 'clients/record'
import StatusBox from 'components/quiz/StatusBox'
import ControlBox from 'components/quiz/ControlBox'
import PlayBox from 'components/quiz/PlayBox'
import ResultBox from 'components/quiz/ResultBox'
import Result from 'models/result'
import Results from 'models/results'
import disableBrowserBackButton from 'disable-browser-back-navigation'
import {useRecoilValue} from 'recoil'
import {userState, userIsLoginState} from 'store/userState'
import {isBrowser} from 'utils/browser'
import {useQuizzes} from 'hooks/quiz'
import {useSection} from 'hooks/section'
import {useCollection} from 'hooks/collection'

export default function PlayPage() {
  const user = useRecoilValue(userState)
  const isLogin = useRecoilValue(userIsLoginState)

  if (isBrowser()) {
    disableBrowserBackButton()
  }

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  const [results, setResults] = useState<Results>(new Results([]))
  const router = useRouter()

  const {collection_id, section_id} = router.query
  const collection = useCollection(collection_id as string)
  const section = useSection(collection_id as string, section_id as string)
  const [quizzes] = useQuizzes(collection_id as string, section_id as string)
  const currentQuiz = quizzes[currentQuizIndex]

  if (!user) {
    return <div>now loading</div>
  }

  const answer = () => {
    setIsAnswered(true)
    const result = new Result(currentQuiz, [selectedAnswerIndex])
    setIsCorrectAnswer(result.isCorrect)
    setResults(results.push(result))
    if (isLogin) {
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

    if (isLogin && user.id && section && collection) {
      saveHistories(user.id)
    }
  }

  const saveHistories = async (userId: string) => {
    await createHistory(
      collection.id,
      collection.title,
      section.id,
      section.title,
      userId,
      results
    )
  }

  const backToCollectionPage = () => {
    router.push(`/collections/${collection_id}`)
  }

  return (
    <LayoutQuiz>
      <main>
        <div className="mb-20">
          <StatusBox
            quizzes={quizzes}
            collectionTitle={collection.title || ''}
            sectionTitle={section.title || ''}
            currentQuizIndex={currentQuizIndex}
            isFinished={isFinished}
            back={backToCollectionPage}
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
            <ResultBox results={results} quizCount={quizzes.length}></ResultBox>
          )}
        </div>
        <div className="fixed w-full max-w-3xl bottom-0 opacity-95 z-50">
          <ControlBox
            quizzes={quizzes}
            currentQuizIndex={currentQuizIndex}
            isAnswered={isAnswered}
            isFinished={isFinished}
            isHistoryMode={false}
            answer={answer}
            next={next}
            finish={finish}
            back={backToCollectionPage}
          ></ControlBox>
        </div>
      </main>
    </LayoutQuiz>
  )
}

import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import LayoutQuiz from 'layouts/layout_quiz'
import {getCollection} from 'clients/collection'
import {getSection} from 'clients/section'
import {getQuizzes} from 'clients/quiz'
import {createHistory} from 'clients/history'
import {addRecord} from 'clients/record'
import StatusBox from 'components/quiz/StatusBox'
import ControlBox from 'components/quiz/ControlBox'
import PlayBox from 'components/quiz/PlayBox'
import ResultBox from 'components/quiz/ResultBox'
import Result from 'models/result'
import Results from 'models/results'
import {connect} from 'react-redux'
import disableBrowserBackButton from 'disable-browser-back-navigation'

function PlayPage({userState}) {
  disableBrowserBackButton()
  const [collection, setCollection] = useState({id: '', title: ''})
  const [section, setSection] = useState({
    id: '',
    title: '',
    collectionId: '',
    creatorId: '',
    updatedAt: new Date(),
  })
  const [quizzes, setQuizzes] = useState([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  const [results, setResults] = useState<Results>(new Results([]))
  const router = useRouter()

  const {collection_id, section_id} = router.query
  const currentQuiz = quizzes[currentQuizIndex]

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      if (!collection_id || !section_id) {
        return
      }
      const [collection, section, quizzes] = await Promise.all([
        getCollection(collection_id as string),
        getSection(collection_id as string, section_id as string),
        getQuizzes(collection_id as string, section_id as string),
      ])
      if (!unmounted) {
        setCollection(collection)
        setSection(section)
        setQuizzes(quizzes)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collection_id, section_id])

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

    if (userState.isLogin && userState.uid && section && collection) {
      saveHistories(userState.uid)
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
        <div>
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
            <ResultBox
              results={results}
              collectionId={collection.id}
              quizCount={quizzes.length}
            ></ResultBox>
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

const mapStateToProps = (state) => {
  return {userState: state}
}

export default connect(mapStateToProps)(PlayPage)

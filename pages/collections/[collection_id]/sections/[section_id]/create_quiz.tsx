import {useState} from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {getCurrentUser} from 'clients/auth'
import {createQuiz} from 'clients/quiz'
import Button from 'components/Button'

export default function CollectionPage() {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState(['', '', '', ''])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState([0])
  const [explanation, setExplanation] = useState('')

  const router = useRouter()
  const {collection_id, section_id} = router.query

  const onChangeQuestion = (event) => {
    setQuestion(event.target.value)
  }

  const onChangeAnswers = (event) => {
    const answersCopy = [...answers]
    answersCopy[event.target.id] = event.target.value
    setAnswers(answersCopy)
  }

  const onChangeCorrectAnswer = (event) => {
    setCorrectAnswerIndex([Number(event.target.value)])
  }

  const onChangeExplantion = (event) => {
    setExplanation(event.target.value)
  }

  const create = async () => {
    const currentUser = getCurrentUser()
    if (!currentUser.uid) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    await createQuiz(
      question,
      answers,
      correctAnswerIndex,
      explanation,
      collection_id as string,
      section_id as string,
      currentUser.uid
    )
    router.push(`/collections/${collection_id}/sections/${section_id}`)
  }

  return (
    <Layout>
      <main className="p-4 bg-white">
        <p className="text-lg font-semibold">問題作成</p>
        <div className="my-2">
          <label>
            <span>問題文</span>
            <textarea
              className="p-2 border w-full"
              onChange={onChangeQuestion}
            />
          </label>
        </div>
        <hr></hr>
        <div className="my-2">
          {answers.map((answer, index) => {
            return (
              <div key={index}>
                <label>
                  <span>{`回答${index + 1}`}</span>
                  <input
                    id={index.toString()}
                    onChange={onChangeAnswers}
                    value={answer}
                    type="text"
                    className="p-2 border w-full"
                  />
                </label>
              </div>
            )
          })}
        </div>
        <hr></hr>
        <div className="my-2">
          <p>正解</p>
          {answers.map((answer, index) => {
            return (
              <div key={index}>
                <label>
                  <input
                    id={index.toString()}
                    onChange={onChangeCorrectAnswer}
                    checked={correctAnswerIndex[0] === index}
                    value={index}
                    type="radio"
                  />
                  <span className="ml-1">{`回答${index + 1}`}</span>
                </label>
              </div>
            )
          })}
        </div>
        <div className="my-2">
          <label>
            <span>解説</span>
            <textarea
              className="p-2 border w-full"
              onChange={onChangeExplantion}
            />
          </label>
        </div>
        <div className="my-4 text-center">
          <Button onClick={create}>作成</Button>
        </div>
      </main>
    </Layout>
  )
}

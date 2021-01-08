import Button from 'components/Button'
import {useForm} from 'react-hook-form'
import {Quiz} from 'models/quiz'
import {useEffect} from 'react'

export type Inputs = {
  question: string
  answers: string[]
  correctAnswerIndex: string[]
  explanation: string
}

export type Outputs = {
  question: string
  answers: string[]
  correctAnswerIndex: number[]
  explanation: string
}

type Props = {
  submitLabel: string
  quiz?: Quiz
  submit: (output: Outputs) => void
}

export default function QuizEditForm({submitLabel, quiz, submit}: Props) {
  const {register, handleSubmit, setValue, formState} = useForm<Inputs>()

  const ANSWER_COUNT = 4

  useEffect(() => {
    if (quiz) {
      setValue('question', quiz.question)
      setValue('answers', quiz.answers)
      setValue('correctAnswerIndex', quiz.correctAnswerIndex.map(String))
      setValue('explanation', quiz.explanation)
    } else {
      setValue('correctAnswerIndex', [0].map(String))
    }
  }, [quiz])

  const onSubmit = (data: Inputs) => {
    submit({
      answers: data.answers,
      question: data.question,
      explanation: data.explanation,
      correctAnswerIndex: data.correctAnswerIndex.map(Number),
    })
  }

  return (
    <div>
      <div className="my-2">
        <label>
          <span>問題文</span>
          <textarea
            name="question"
            className="p-2 border w-full"
            ref={register}
          />
        </label>
      </div>
      <hr></hr>
      <div className="my-2">
        {(() => {
          const items = []
          for (let i = 0; i < ANSWER_COUNT; i++) {
            items.push(
              <div key={i}>
                <label>
                  <span>{`回答${i + 1}`}</span>
                  <input
                    name={`answers[${i}]`}
                    id={i.toString()}
                    type="text"
                    className="p-2 border w-full"
                    ref={register}
                  />
                </label>
              </div>
            )
          }
          return items
        })()}
      </div>
      <hr></hr>
      <div className="my-2">
        <p>正解</p>
        {(() => {
          const items = []
          for (let i = 0; i < ANSWER_COUNT; i++) {
            items.push(
              <div key={i}>
                <label>
                  <input
                    id={i.toString()}
                    type="radio"
                    value={i}
                    ref={register}
                    name="correctAnswerIndex[0]"
                  />
                  <span className="ml-1">{`回答${i + 1}`}</span>
                </label>
              </div>
            )
          }
          return items
        })()}
      </div>
      <div className="my-2">
        <label>
          <span>解説</span>
          <textarea
            name="explanation"
            className="p-2 border w-full"
            ref={register}
          />
        </label>
      </div>
      <div className="my-4 text-center">
        <Button onClick={handleSubmit(onSubmit)}>{submitLabel}</Button>
      </div>
    </div>
  )
}

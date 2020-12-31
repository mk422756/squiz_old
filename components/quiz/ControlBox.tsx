import React from 'react'
import {Quiz} from 'models/quiz'
import Button from 'components/Button'

type ControlBoxProps = {
  quizzes: Quiz[]
  currentQuizIndex: number
  isAnswered: boolean
  isFinished: boolean
  answer: () => void
  next: () => void
  finish: () => void
  back: () => void
}

const ControlBox = ({
  quizzes,
  currentQuizIndex,
  isAnswered,
  isFinished,
  answer,
  next,
  finish,
  back,
}: ControlBoxProps) => {
  const isFinelQuiz = quizzes.length === currentQuizIndex + 1

  const button = () => {
    if (!isAnswered) {
      return <Button onClick={answer}>回答</Button>
    }

    if (isFinished) {
      return (
        <Button onClick={back} fullWidth={true}>
          問題集に戻る
        </Button>
      )
    }

    if (isFinelQuiz) {
      return <Button onClick={finish}>終了</Button>
    }

    return <Button onClick={next}>次へ</Button>
  }
  return (
    <div className="p-4 bg-gray-100">
      {isFinished ? (
        <div>{button()}</div>
      ) : (
        <div className="grid grid-cols-3">
          <div className="my-auto">
            {/* TODO 戻るを実装する */}
            {/* <span className="text-primary">戻る</span> */}
          </div>
          <div className="mx-auto">{button()}</div>
        </div>
      )}
    </div>
  )
}

export default ControlBox

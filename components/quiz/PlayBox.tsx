import React from 'react'
import {Quiz} from 'models/quiz'

type AnswerBoxProps = {
  answer: string
  index: number
  selectedAnswerIndex: number
  handleAnswers: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AnswerBox = ({
  answer,
  index,
  selectedAnswerIndex,
  handleAnswers,
}: AnswerBoxProps) => {
  return (
    <div className="my-3 mx-4 p-3 bg-white rounded shadow">
      <label className="grid grid-cols-12">
        <input
          type="radio"
          value={index}
          checked={selectedAnswerIndex === index}
          onChange={handleAnswers}
          className="my-auto"
        ></input>
        <div className="ml-1 break-words col-span-11">{answer}</div>
      </label>
    </div>
  )
}

type PlayBoxProps = {
  quizzes: Quiz[]
  currentQuizIndex: number
  isAnswered: boolean
  isCorrectAnswer: boolean
  selectedAnswerIndex: number
  finish: () => void
  setSelectedAnswerIndex: (number) => void
}

const PlayBox = ({
  quizzes,
  currentQuizIndex,
  isAnswered,
  isCorrectAnswer,
  selectedAnswerIndex,
  setSelectedAnswerIndex,
}: PlayBoxProps) => {
  const currentQuiz = quizzes[currentQuizIndex]

  const handleAnswers = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswerIndex(Number(e.target.value))
  }

  if (!currentQuiz) {
    // TODO ローディング等を入れる
    return null
  }

  return (
    <div>
      <div className="p-4 mt-2 bg-white break-words">
        {currentQuiz.question}
      </div>

      <div>
        {currentQuiz.answers.map((answer, index) => {
          return (
            <AnswerBox
              key={index}
              answer={answer}
              index={index}
              selectedAnswerIndex={selectedAnswerIndex}
              handleAnswers={handleAnswers}
            ></AnswerBox>
          )
        })}
      </div>
      {isAnswered && (
        <div className="bg-white mt-3 p-4">
          <div className="text-2xl font-semibold">
            {isCorrectAnswer ? (
              <div>
                <span className="text-green-400">○</span>
                <span className="ml-2">正解</span>
              </div>
            ) : (
              <div>
                <span className="text-red-400">×</span>
                <span className="ml-2">不正解</span>
              </div>
            )}
          </div>
          <p className="break-words mt-2">{currentQuiz.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default PlayBox

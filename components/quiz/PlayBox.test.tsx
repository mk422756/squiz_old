import PlayBox from './PlayBox'
import React from 'react'
import {render} from '@testing-library/react'
import {Quiz} from 'models/quiz'

describe('テスト実行画面', () => {
  it('正しく正解の表示がされる', () => {
    const quizzes: Quiz[] = [
      {
        id: 'aaaaa',
        sectionId: 'bbbbb',
        collectionId: 'ccccc',
        creatorId: 'ddddd',
        question: '1+1=',
        answers: ['1', '2', '3', '4'],
        correctAnswerIndex: [1],
        explanation: '解説',
        type: 'alternative',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    let isAnswered = false
    const {getByText, queryByText, rerender} = render(
      <PlayBox
        quizzes={quizzes}
        finish={() => {}}
        isAnswered={isAnswered}
        selectedAnswerIndex={1}
        isCorrectAnswer={true}
        currentQuizIndex={0}
        setSelectedAnswerIndex={() => {}}
      />
    )
    const explanationElement = queryByText(/^正解$/)
    expect(explanationElement).toBeFalsy()

    isAnswered = true
    rerender(
      <PlayBox
        quizzes={quizzes}
        finish={() => {}}
        isAnswered={isAnswered}
        selectedAnswerIndex={1}
        isCorrectAnswer={true}
        currentQuizIndex={0}
        setSelectedAnswerIndex={() => {}}
      />
    )
    const explanationElement2 = getByText(/^正解$/)
    expect(explanationElement2).toBeInTheDocument()
  })

  it('正しく正解の表示がされる', () => {
    const quizzes: Quiz[] = [
      {
        id: 'aaaaa',
        sectionId: 'bbbbb',
        collectionId: 'ccccc',
        creatorId: 'ddddd',
        question: '1+1=',
        answers: ['1', '2', '3', '4'],
        correctAnswerIndex: [1],
        explanation: '解説',
        type: 'alternative',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    let isAnswered = false
    const {getByText, queryByText, rerender} = render(
      <PlayBox
        quizzes={quizzes}
        finish={() => {}}
        isAnswered={isAnswered}
        selectedAnswerIndex={0}
        isCorrectAnswer={false}
        currentQuizIndex={0}
        setSelectedAnswerIndex={() => {}}
      />
    )
    const explanationElement = queryByText(/^不正解$/)
    expect(explanationElement).toBeFalsy()

    isAnswered = true
    rerender(
      <PlayBox
        quizzes={quizzes}
        finish={() => {}}
        isAnswered={isAnswered}
        selectedAnswerIndex={0}
        isCorrectAnswer={false}
        currentQuizIndex={0}
        setSelectedAnswerIndex={() => {}}
      />
    )
    const explanationElement2 = getByText(/^不正解$/)
    expect(explanationElement2).toBeInTheDocument()
  })
})

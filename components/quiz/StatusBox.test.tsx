import StatusBox from './StatusBox'
import React from 'react'
import {render} from '@testing-library/react'
import {Quiz} from 'models/quiz'

describe('問題ステータス', () => {
  it('適切に表示される', () => {
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
    const {getByText} = render(
      <StatusBox
        quizzes={quizzes}
        collectionId="ccccc"
        collectionTitle="問題集タイトル"
        sectionTitle="セクションタイトル"
        currentQuizIndex={1}
      />
    )

    const collectionTitleElement = getByText(/問題集タイトル/)
    expect(collectionTitleElement).toBeInTheDocument()
    const sectionTitleElement = getByText(/セクションタイトル/)
    expect(sectionTitleElement).toBeInTheDocument()
  })
})

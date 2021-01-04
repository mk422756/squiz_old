import firebase from 'lib/firebase'
import cuid from 'cuid'
import Results from 'models/results'

const db = firebase.firestore()

export const createHistory = async (
  collectionId: string,
  collectionTitle: string,
  sectionId: string,
  sectionTitle: string,
  userId: string,
  results: Results
) => {
  const id = cuid()
  const resultsArray = results.value.map((result) => {
    return {
      question: result.quiz.question,
      explanation: result.quiz.explanation,
      answers: result.quiz.answers,
      correctAnswerIndex: result.quiz.correctAnswerIndex,
      answerIndex: result.answerIndex,
    }
  })
  const batch = db.batch()

  batch.set(
    db.collection('users').doc(userId).collection('histories').doc(id),
    {
      collectionId,
      collectionTitle,
      sectionId,
      sectionTitle,
      quizCount: results.length,
      correctCount: results.correctCount,
      incorrectCount: results.incorrectCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  )

  batch.set(
    db
      .collection('users')
      .doc(userId)
      .collection('histories')
      .doc(id)
      .collection('details')
      .doc('results'),
    {results: resultsArray}
  )

  await batch.commit()

  return id
}

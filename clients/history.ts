import firebase from 'lib/firebase'
import cuid from 'cuid'
import Results from 'models/results'
import {History} from 'models/history'

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

export const getHistoriesByUserId = async (
  userId: string
): Promise<History[]> => {
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('histories')
    .get()

  return snapshot.docs.map((doc) => {
    return snapshotToHistory(doc)
  })
}

const snapshotToHistory = (
  snapshot: firebase.firestore.DocumentSnapshot
): History => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    collectionId: data.collectionId,
    collectionTitle: data.collectionTitle || '',
    sectionId: data.sectionId,
    sectionTitle: data.sectionTitle || '',
    userId: data.userId,
    correctCount: data.correctCount || 0,
    incorrectCount: data.incorrectCount || 0,
    quizCount: data.quizCount || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

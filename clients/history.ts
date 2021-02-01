import firebase from 'lib/firebase'
import cuid from 'cuid'
import Results from 'models/results'
import {History, HistoryDetail, HistoryDetails} from 'models/history'
import {nullableArray2NonullableArray} from 'utils/array'

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
      quizId: result.quiz.id,
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

  const histories = snapshot.docs.map((doc) => {
    return snapshotToHistory(doc, userId)
  })

  return nullableArray2NonullableArray<History>(histories)
}

export const getHistory = async (
  userId: string,
  id: string
): Promise<HistoryDetails | null> => {
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('histories')
    .doc(id)
    .get()

  const detailSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('histories')
    .doc(id)
    .collection('details')
    .doc('results')
    .get()

  const history = snapshotToHistory(snapshot, userId)
  if (!history) {
    return null
  }
  const details = snapshotToHistoryDetails(detailSnapshot)
  return new HistoryDetails(history, details)
}

const snapshotToHistory = (
  snapshot: firebase.firestore.DocumentSnapshot,
  userId: string
): History | null => {
  if (!snapshot.exists) {
    return null
  }
  const data = snapshot.data()

  if (!data) {
    return null
  }
  return {
    id: snapshot.id,
    collectionId: data.collectionId,
    collectionTitle: data.collectionTitle || '',
    sectionId: data.sectionId,
    sectionTitle: data.sectionTitle || '',
    userId: userId,
    correctCount: data.correctCount || 0,
    incorrectCount: data.incorrectCount || 0,
    quizCount: data.quizCount || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

const snapshotToHistoryDetails = (
  snapshot: firebase.firestore.DocumentSnapshot
): HistoryDetail[] => {
  if (!snapshot.exists) {
    return []
  }
  const data = snapshot.data()
  if (!data) {
    return []
  }
  const results = data.results
  return results.map((result: any) => {
    return {
      quizId: result.quizId,
      question: result.question,
      answers: result.answers,
      correctAnswerIndex: result.correctAnswerIndex,
      answerIndex: result.answerIndex,
      explanation: result.explanation,
      type: result.type,
    }
  })
}

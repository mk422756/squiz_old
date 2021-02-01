import firebase from 'lib/firebase'
import cuid from 'cuid'
import {Quiz} from 'models/quiz'
import {nullableArray2NonullableArray} from 'utils/array'

const db = firebase.firestore()

export const createQuiz = async (
  question: string,
  answers: string[],
  correctAnswerIndex: number[],
  explanation: string,
  collectionId: string,
  sectionId: string,
  creatorId: string
) => {
  const id = cuid()
  await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(sectionId)
    .collection('quizzes')
    .doc(id)
    .set({
      question,
      answers,
      correctAnswerIndex,
      explanation,
      collectionId,
      type: 'alternative',
      sectionId,
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  return id
}

export const updateQuiz = async (
  id: string,
  question: string,
  answers: string[],
  correctAnswerIndex: number[],
  explanation: string,
  collectionId: string,
  sectionId: string
) => {
  await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(sectionId)
    .collection('quizzes')
    .doc(id)
    .set(
      {
        question,
        answers,
        correctAnswerIndex,
        explanation,
        type: 'alternative',
        updatedAt: new Date(),
      },
      {merge: true}
    )
  return id
}
export const deleteQuiz = async (
  collectionId: string,
  sectionId: string,
  id: string
): Promise<void> => {
  await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(sectionId)
    .collection('quizzes')
    .doc(id)
    .delete()
}

export const getQuizzes = async (
  collectionId: string,
  sectionId: string
): Promise<Quiz[]> => {
  const snapshot = await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(sectionId)
    .collection('quizzes')
    .get()
  const quizzes = snapshot.docs.map((doc) => {
    return snapshotToQuiz(doc)
  })

  return nullableArray2NonullableArray(quizzes)
}

export const getQuiz = async (
  collectionId: string,
  sectionId: string,
  id: string
): Promise<Quiz | null> => {
  const snapshot = await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(sectionId)
    .collection('quizzes')
    .doc(id)
    .get()
  return snapshotToQuiz(snapshot)
}

const snapshotToQuiz = (
  snapshot: firebase.firestore.DocumentSnapshot
): Quiz | null => {
  const data = snapshot.data()
  if (!data) {
    return null
  }
  return {
    id: snapshot.id,
    question: data.question || '',
    answers: data.answers || [],
    correctAnswerIndex: data.correctAnswerIndex || [],
    explanation: data.explanation || '',
    type: data.explanation || '',
    collectionId: data.collectionId,
    sectionId: data.sectionId,
    creatorId: data.creatorId,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

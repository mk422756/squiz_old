import firebase from 'lib/firebase'
import cuid from 'cuid'
import {Quiz} from 'models/quiz'

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
  return snapshot.docs.map((doc) => {
    return snapshotToQuiz(doc)
  })
}

const snapshotToQuiz = (
  snapshot: firebase.firestore.DocumentSnapshot
): Quiz => {
  const data = snapshot.data()
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

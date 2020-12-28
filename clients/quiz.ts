import firebase from 'lib/firebase'
import cuid from 'cuid'

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

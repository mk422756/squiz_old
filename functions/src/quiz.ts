import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export const onCreateQuiz = functions.firestore
  .document('collections/{collectionId}/sections/{sectionId}/quizzes/{quizId}')
  .onCreate(async (_, context) => {
    const snapshot = await firestore
      .collection('collections')
      .doc(context.params.collectionId)
      .collection('sections')
      .doc(context.params.sectionId)
      .collection('quizzes')
      .get()

    return await updateSectionQuizCount(
      context.params.collectionId,
      context.params.sectionId,
      snapshot.size
    )
  })

export const onDelete = functions.firestore
  .document('collections/{collectionId}/sections/{sectionId}/quizzes/{quizId}')
  .onDelete(async (_, context) => {
    const snapshot = await firestore
      .collection('collections')
      .doc(context.params.collectionId)
      .collection('sections')
      .doc(context.params.sectionId)
      .collection('quizzes')
      .get()

    return await updateSectionQuizCount(
      context.params.collectionId,
      context.params.sectionId,
      snapshot.size
    )
  })

async function updateSectionQuizCount(
  collectionId: string,
  sectionId: string,
  count: number
) {
  return await firestore
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(sectionId)
    .set({quizCount: count, updatedAt: new Date()}, {merge: true})
}

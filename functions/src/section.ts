import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export const onWriteSection = functions.firestore
  .document('collections/{collectionId}/sections/{sectionId}')
  .onWrite(async (_, context) => {
    const querySnapshot = await firestore
      .collection('collections')
      .doc(context.params.collectionId)
      .collection('sections')
      .get()

    return await updateCollectionQuizCount(
      context.params.collectionId,
      querySnapshot
    )
  })

// collections内の全てのsectionsのquizCountを合計してセットする
async function updateCollectionQuizCount(
  collectionId: string,
  querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) {
  const totalQuizCount = querySnapshot.docs
    .map((doc): number => {
      if (!doc.exists) {
        return 0
      }
      const data = doc.data()
      return data.quizCount ?? 0
    })
    .reduce(function (accumulator, currentValue) {
      return accumulator + currentValue
    })
  return await firestore
    .collection('collections')
    .doc(collectionId)
    .set({quizCount: totalQuizCount, updatedAt: new Date()}, {merge: true})
}

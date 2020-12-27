import firebase from 'lib/firebase'
import cuid from 'cuid'

const db = firebase.firestore()

export const createSection = async (title: string, collectionId: string) => {
  const id = cuid()
  await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(id)
    .set({
      title,
      collectionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  return id
}

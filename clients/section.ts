import firebase from 'lib/firebase'
import cuid from 'cuid'
import {Section} from 'models/section'

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

export const getSections = async (collectionId: string): Promise<Section[]> => {
  const snapshot = await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .get()
  return snapshot.docs.map((doc) => {
    return snapshotToSection(doc)
  })
}

const snapshotToSection = (
  snapshot: firebase.firestore.DocumentSnapshot
): Section => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    title: data.title || '',
    collectionId: data.collectionId,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

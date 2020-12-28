import firebase from 'lib/firebase'
import cuid from 'cuid'
import {Section} from 'models/section'

const db = firebase.firestore()

export const createSection = async (
  title: string,
  collectionId: string,
  creatorId: string
) => {
  const id = cuid()
  await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(id)
    .set({
      title,
      collectionId,
      creatorId,
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

export const getSection = async (
  collectionId: string,
  sectionId: string
): Promise<Section | null> => {
  const snapshot = await db
    .collection('collections')
    .doc(collectionId)
    .collection('sections')
    .doc(sectionId)
    .get()

  if (!snapshot.exists) {
    return
  }
  return snapshotToSection(snapshot)
}

const snapshotToSection = (
  snapshot: firebase.firestore.DocumentSnapshot
): Section => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    title: data.title || '',
    collectionId: data.collectionId,
    creatorId: data.creatorId,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

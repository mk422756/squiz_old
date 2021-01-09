import firebase from 'lib/firebase'
import cuid from 'cuid'
import {Collection} from 'models/collection'
import {putFile} from 'utils/firebaseStorage'

const db = firebase.firestore()

export const createCollection = async (
  title: string,
  description: string,
  creatorId: string
) => {
  const id = cuid()
  await db.collection('collections').doc(id).set({
    title,
    description,
    creatorId,
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return id
}

export const updateCollection = async (
  id: string,
  title: string,
  description: string,
  creatorId: string,
  isPublic: boolean,
  tags: string[],
  imageBlob?: Blob
) => {
  const imageUrl = imageBlob
    ? await putFile(`collections/${id}/collection_image`, imageBlob)
    : ''
  await db.collection('collections').doc(id).set({
    title,
    description,
    creatorId,
    isPublic,
    tags,
    imageUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return id
}

export const getCollection = async (id: string): Promise<Collection | null> => {
  const snapshot = await db.collection('collections').doc(id).get()
  if (!snapshot.exists) {
    return
  }
  return snapshotToCollection(snapshot)
}

export const getCollections = async (): Promise<Collection[]> => {
  const snapshot = await db.collection('collections').get()

  return snapshot.docs.map((doc) => {
    return snapshotToCollection(doc)
  })
}

export const getCollectionsByTag = async (
  tag: string
): Promise<Collection[]> => {
  const snapshot = await db
    .collection('collections')
    .where('tags', 'array-contains', tag)
    .get()

  return snapshot.docs.map((doc) => {
    return snapshotToCollection(doc)
  })
}

export const getCollectionsByUserId = async (
  userId: string
): Promise<Collection[]> => {
  const snapshot = await db
    .collection('collections')
    .where('creatorId', '==', userId)
    .get()

  return snapshot.docs.map((doc) => {
    return snapshotToCollection(doc)
  })
}

const snapshotToCollection = (
  snapshot: firebase.firestore.DocumentSnapshot
): Collection => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    title: data.title || '',
    description: data.description || '',
    isPublic: data.isPublic || false,
    creatorId: data.creatorId,
    tags: data.tags || [],
    imageUrl: data.imageUrl || '',
    quizCount: data.quizCount || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

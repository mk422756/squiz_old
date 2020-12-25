import firebase from '../lib/firebase'
import cuid from 'cuid'

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
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return id
}

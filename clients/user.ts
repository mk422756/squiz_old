import firebase from '../lib/firebase'
import {User} from '../models/user'

const db = firebase.firestore()

export const createUser = async (uid: string) => {
  await db
    .collection('users')
    .doc(uid)
    .set({name: 'no name', createdAt: new Date(), updatedAt: new Date()})
}

export const updateUser = async (
  uid: string,
  name: string,
  description: string,
  twitterId: string,
  facebookId: string
) => {
  await db
    .collection('users')
    .doc(uid)
    .set(
      {name, description, twitterId, facebookId, updatedAt: new Date()},
      {merge: true}
    )
}

export const getUser = async (uid: string): Promise<User | null> => {
  const ret = await db.collection('users').doc(uid).get()
  if (!ret.exists) {
    return
  }
  const data = ret.data()
  return {
    id: ret.id,
    name: data.name || '',
    description: data.description || '',
    twitterId: data.twitterId || '',
    facebookId: data.facebookId || '',
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

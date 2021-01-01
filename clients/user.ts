import firebase from 'lib/firebase'
import {User} from 'models/user'
import {putFile} from 'utils/firebaseStorage'

const db = firebase.firestore()
const storage = firebase.storage()

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
  facebookId: string,
  imageBlob?: Blob
) => {
  let imageUrl = ''
  if (imageBlob) {
    imageUrl = await putFile(`users/${uid}/user_image`, imageBlob)
  }
  await db.collection('users').doc(uid).set(
    {
      name,
      description,
      twitterId,
      facebookId,
      imageUrl,
      updatedAt: new Date(),
    },
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
    imageUrl: data.imageUrl || '',
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

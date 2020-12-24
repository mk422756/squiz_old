import firebase from '../lib/firebase'

const db = firebase.firestore()

export const createUser = async (uid: string) => {
  await db.collection('users').doc(uid).set({name: 'no name'})
}

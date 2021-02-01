import firebase from '../lib/firebase'
import {useAuthState as _useAuthState} from 'react-firebase-hooks/auth'

const auth = firebase.auth()

export const emailSignup = async (email: string, password: string) => {
  const credential = await auth.createUserWithEmailAndPassword(email, password)
  return credential.user?.uid
}

export const emailLogin = async (email: string, password: string) => {
  const credential = await auth.signInWithEmailAndPassword(email, password)
  return credential.user?.uid
}

export const logout = async () => {
  await auth.signOut()
}

export const getCurrentUser = () => {
  return auth?.currentUser
}

export const getAuthState = () => {
  return _useAuthState(auth)
}

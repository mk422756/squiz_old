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

export const googleLogin = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  auth.signInWithRedirect(provider)
}

export const getRedirectInfo = async () => {
  const cred = await auth.getRedirectResult()
  return {uid: cred.user?.uid, isNewUser: cred.additionalUserInfo?.isNewUser}
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

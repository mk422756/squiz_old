import firebase from '../lib/firebase'
import {useAuthState as _useAuthState} from 'react-firebase-hooks/auth'

const auth = firebase.auth()

export const emailSignup = async (email: string, password: string) => {
  const ret = await auth.createUserWithEmailAndPassword(email, password)
  return ret.user.uid
}

export const emailLogin = async (email: string, password: string) => {
  await auth.signInWithEmailAndPassword(email, password)
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

export const getIsLogin = () => {
  const [user, loading, error] = getAuthState()
  const ret = user && !loading && !error
  return !!ret
}

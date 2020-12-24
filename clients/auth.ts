import firebase from '../lib/firebase'
import {useAuthState as _useAuthState} from 'react-firebase-hooks/auth'

export const emailSignup = async (email: string, password: string) => {
  const ret = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
  return ret.user.uid
}

export const emailLogin = async (email: string, password: string) => {
  await firebase.auth().signInWithEmailAndPassword(email, password)
}

export const getCurrentUser = () => {
  return firebase.auth()?.currentUser
}

export const getAuthState = () => {
  return _useAuthState(firebase.auth())
}

export const getIsLogin = () => {
  const [user, loading, error] = getAuthState()
  const ret = user && !loading && !error
  return !!ret
}

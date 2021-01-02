import {
  configureStore,
  getDefaultMiddleware,
  EnhancedStore,
} from '@reduxjs/toolkit'
import logger from 'redux-logger'
import {createSlice} from '@reduxjs/toolkit'
import firebase from 'lib/firebase'
import {getUser} from 'clients/user'
import {User} from 'models/user'

const auth = firebase.auth()

type SerializeUser = Omit<User, 'updatedAt' | 'createdAt'>

type UserState = {
  isLogin: boolean
  uid: string
  user?: SerializeUser
}

export const initialUserState: UserState = {
  isLogin: false,
  uid: '',
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: initialUserState,
  reducers: {
    login: (state, uid) => {
      return {...state, uid: uid.payload, isLogin: true}
    },
    logout: () => {
      return initialUserState
    },
    setUser: (state, {payload}: {payload: SerializeUser}) => {
      return {...state, user: payload}
    },
  },
})

export const {actions, reducer} = counterSlice
export const {login, logout, setUser} = actions

export const setupStore = (): EnhancedStore => {
  const middlewares = [...getDefaultMiddleware()]

  // only development
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger)
  }

  const store = configureStore({
    reducer: counterSlice.reducer,
    middleware: middlewares,
    devTools: true,
  })

  auth.onAuthStateChanged((user) => {
    if (user) {
      store.dispatch(login(user.uid))
      getUser(user.uid).then((user) => {
        delete user.updatedAt
        delete user.createdAt
        store.dispatch(setUser(user))
      })
      console.log('login changed')
    } else {
      store.dispatch(logout())
      console.log('logout called')
    }
  })

  return store
}

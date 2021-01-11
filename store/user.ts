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

export type UserState = {
  isLogin: boolean
  uid: string
  user?: User
}

const initialUserState: UserState = {
  isLogin: false,
  uid: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    login: (state, uid) => {
      return {...state, uid: uid.payload, isLogin: true}
    },
    logout: () => {
      return initialUserState
    },
    setUser: (state, {payload}: {payload: User}) => {
      return {...state, user: payload}
    },
  },
})

export const {actions, reducer} = userSlice
export const {login, logout, setUser} = actions

export const setupStore = (): EnhancedStore => {
  const middlewares = [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/setUser'],
      },
    }),
  ]

  // only development
  // if (process.env.NODE_ENV === 'development') {
  //   middlewares.push(logger)
  // }

  // const persistConfig = {
  //   key: 'user',
  //   version: 1,
  //   storage,
  // }

  const store = configureStore({
    reducer: userSlice.reducer,
    middleware: middlewares,
    devTools: true,
  })

  auth.onAuthStateChanged((user) => {
    if (user) {
      store.dispatch(login(user.uid))
      getUser(user.uid).then((user) => {
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

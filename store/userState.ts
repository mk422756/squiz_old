import {atom, selector, DefaultValue} from 'recoil'
import {User} from 'models/user'
import {localStorageEffect} from './localStorageEffect'

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
  effects_UNSTABLE: [localStorageEffect('user_state')],
})

export const userIsLoginState = selector({
  key: 'userIsLoginState',
  get: ({get}) => {
    const user = get(userState)
    return !!user
  },
})

import {atom, selector, DefaultValue} from 'recoil'
import {User} from 'models/user'
import {isBrowser} from 'utils/browser'

const localStorageEffect = (key) => ({setSelf, onSet}) => {
  if (!isBrowser()) {
    return
  }
  const savedValue = localStorage.getItem(key)
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue))
  }

  onSet((newValue) => {
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  })
}

export const userState = atom({
  key: 'userState',
  default: null as User,
  effects_UNSTABLE: [localStorageEffect('user')],
})

export const userIsLoginState = selector({
  key: 'userIsLoginState',
  get: ({get}) => {
    const user = get(userState)
    return !!user
  },
})

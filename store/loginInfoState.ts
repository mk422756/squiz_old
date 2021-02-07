import {atom} from 'recoil'
import {localStorageEffect} from './localStorageEffect'

type LoginInfo = {
  urlAfterLogin: string
}

export const loginInfoState = atom<LoginInfo | null>({
  key: 'loginInfoState',
  default: null,
  effects_UNSTABLE: [localStorageEffect('login_info_state')],
})

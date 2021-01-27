import {atom} from 'recoil'

type LoginInfo = {
  urlAfterLogin: string
}

export const loginInfoState = atom<LoginInfo | null>({
  key: 'loginInfoState',
  default: null,
})

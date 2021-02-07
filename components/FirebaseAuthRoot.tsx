import {useEffect} from 'react'
import {useSetRecoilState, useRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'
import {loginInfoState} from 'store/loginInfoState'
import {getUser, createUser, getPurchasedCollectionIds} from 'clients/user'
import firebase from 'lib/firebase'
import {useRouter} from 'next/router'
import {getRedirectInfo} from 'clients/auth'

const auth = firebase.auth()

export default function FirebaseAuthRoot({children}: any) {
  const router = useRouter()

  const setUserState = useSetRecoilState(userState)
  const setPurchasedCollectionsInfoState = useSetRecoilState(
    purchasedCollectionsInfoState
  )
  const [loginInfo, setLoginInfo] = useRecoilState(loginInfoState)

  useEffect(() => {
    getRedirectInfo().then(async (uid) => {
      if (uid) {
        const user = await getUser(uid)
        if (!user) {
          await createUser(uid)
        }
        if (loginInfo && loginInfo.urlAfterLogin) {
          router.push(loginInfo.urlAfterLogin)
          setLoginInfo(null)
        } else {
          router.push(`/users/${uid}`)
        }
      }
    })
    auth.onAuthStateChanged((user) => {
      if (user) {
        // TODO Firestoreをリアルタイムアップデートする
        getUser(user.uid).then((user) => {
          if (user) {
            setUserState(user)
          }
        })
        getPurchasedCollectionIds(user.uid).then((infos) => {
          setPurchasedCollectionsInfoState(infos)
        })
        console.log('login changed')
      } else {
        setUserState(null)
        setPurchasedCollectionsInfoState([])
        setLoginInfo(null)
        console.log('logout called')
      }
    })
  }, [])

  return <>{children}</>
}

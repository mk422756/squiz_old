import {useEffect} from 'react'
import {useSetRecoilState, useRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'
import {loginInfoState} from 'store/loginInfoState'
import {
  createUser,
  getPurchasedCollectionIds,
  snapshotToUser,
} from 'clients/user'
import firebase from 'lib/firebase'
import {useRouter} from 'next/router'
import {getRedirectInfo} from 'clients/auth'

const auth = firebase.auth()
const firestore = firebase.firestore()

export default function FirebaseAuthRoot({children}: any) {
  const router = useRouter()

  const setUserState = useSetRecoilState(userState)
  const setPurchasedCollectionsInfoState = useSetRecoilState(
    purchasedCollectionsInfoState
  )
  const [loginInfo, setLoginInfo] = useRecoilState(loginInfoState)

  useEffect(() => {
    getRedirectInfo().then(async (info) => {
      if (info.uid) {
        if (info.isNewUser) {
          await createUser(info.uid)
        }
        if (loginInfo && loginInfo.urlAfterLogin) {
          router.push(loginInfo.urlAfterLogin)
          setLoginInfo(null)
        } else {
          router.push(`/users/${info.uid}`)
        }
      }
    })
    auth.onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection('users')
          .doc(user.uid)
          .onSnapshot((snapshot) => {
            setUserState(snapshotToUser(snapshot))
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

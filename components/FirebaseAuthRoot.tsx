import {useEffect} from 'react'
import {useSetRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'
import {loginInfoState} from 'store/loginInfoState'
import {getUser, getPurchasedCollectionIds} from 'clients/user'
import firebase from 'lib/firebase'
const auth = firebase.auth()

export default function FirebaseAuthRoot({children}) {
  const setUserState = useSetRecoilState(userState)
  const setPurchasedCollectionsInfoState = useSetRecoilState(
    purchasedCollectionsInfoState
  )
  const setLoginInfoState = useSetRecoilState(loginInfoState)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUser(user.uid).then((user) => {
          setUserState(user)
        })
        getPurchasedCollectionIds(user.uid).then((infos) => {
          setPurchasedCollectionsInfoState(infos)
        })
        console.log('login changed')
      } else {
        setUserState(null)
        setPurchasedCollectionsInfoState([])
        setLoginInfoState(null)
        console.log('logout called')
      }
    })
  }, [])

  return <>{children}</>
}

import {useEffect} from 'react'
import {useSetRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsState} from 'store/purchasedCollectionsState'
import {loginInfoState} from 'store/loginInfoState'
import {getUser, getPurchasedCollectionIds} from 'clients/user'
import firebase from 'lib/firebase'
const auth = firebase.auth()

export default function FirebaseAuthRoot({children}) {
  const setUserState = useSetRecoilState(userState)
  const setPurchasedCollectionsState = useSetRecoilState(
    purchasedCollectionsState
  )
  const setLoginInfoState = useSetRecoilState(loginInfoState)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUser(user.uid).then((user) => {
          setUserState(user)
        })
        getPurchasedCollectionIds(user.uid).then((collectionIds) => {
          setPurchasedCollectionsState(collectionIds)
        })
        console.log('login changed')
      } else {
        setUserState(null)
        setPurchasedCollectionsState([])
        setLoginInfoState(null)
        console.log('logout called')
      }
    })
  }, [])

  return <>{children}</>
}

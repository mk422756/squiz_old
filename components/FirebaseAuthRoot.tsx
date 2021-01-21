import {useEffect} from 'react'
import {useSetRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {getUser} from 'clients/user'
import firebase from 'lib/firebase'
const auth = firebase.auth()

export default function FirebaseAuthRoot({children}) {
  const setUserState = useSetRecoilState(userState)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUser(user.uid).then((user) => {
          setUserState(user)
        })
        console.log('login changed')
      } else {
        setUserState(null)
        console.log('logout called')
      }
    })
  }, [])

  return <>{children}</>
}

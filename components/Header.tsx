import Link from 'next/link'
import {useEffect, useState} from 'react'
import {getIsLogin, getCurrentUser} from '../clients/auth'
import {getUser} from '../clients/user'
import {faBook} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const LoginLink = () => {
  const [user, setUser] = useState({} as any)
  const isLogin = getIsLogin()
  const currentUser = getCurrentUser()

  // TODO ページ遷移の度に動作するためなんとかする
  useEffect(() => {
    let unmounted = false

    ;(async () => {
      if (!currentUser) {
        return
      }
      const _user = await getUser(currentUser.uid as string)
      if (!unmounted) {
        setUser(_user)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [currentUser])
  return (
    <div>
      {isLogin ? (
        <ul>
          <li className="mx-4 inline-block h-6 w-6 align-middle">
            {/* TODO */}
            <a>
              <FontAwesomeIcon icon={faBook} color="white" className="fa-lg" />
            </a>
          </li>
          <li className="inline-block">
            <Link href={`/users/${currentUser.uid}`}>
              <img
                className="inline-block h-8 w-8 rounded-full bg-white"
                src={user.imageUrl}
              />
            </Link>
          </li>
        </ul>
      ) : (
        <Link href="/login">
          <a className="text-white">ログイン</a>
        </Link>
      )}
    </div>
  )
}

export default function Header() {
  return (
    <header className="mx-auto flex justify-between bg-primary">
      <div className="my-3 mx-4 float-left">
        <Link href="/">
          <a className="text-white text-3xl">SQUIZ</a>
        </Link>
      </div>

      <div className="my-auto mx-4 float-right">
        <LoginLink />
      </div>
    </header>
  )
}

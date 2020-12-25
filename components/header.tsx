import Link from 'next/link'
import {getIsLogin, getCurrentUser} from '../clients/auth'
import {faBook} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const LoginLink = () => {
  const isLogin = getIsLogin()
  const user = getCurrentUser()
  return (
    <>
      {isLogin ? (
        <ul>
          <li className="mx-4 inline-block h-6 w-6 align-middle">
            {/* TODO */}
            <a>
              <FontAwesomeIcon icon={faBook} color="white" className="fa-lg" />
            </a>
          </li>
          <li className="inline-block">
            <Link href={`/users/${user.uid}`}>
              <img
                className="inline-block h-8 w-8 rounded-full bg-white"
                src="/user_avatar.png"
                alt="ユーザーイメージ"
              />
            </Link>
          </li>
        </ul>
      ) : (
        <Link href="/login">
          <a className="text-white">ログイン</a>
        </Link>
      )}
    </>
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

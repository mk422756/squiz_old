import Link from 'next/link'
import {faHistory} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useRecoilValue} from 'recoil'
import {userState, userIsLoginState} from 'store/userState'

const LoginLink = ({openSidebar}) => {
  const isLogin = useRecoilValue(userIsLoginState)
  const user = useRecoilValue(userState)
  return (
    <div>
      {isLogin ? (
        <ul>
          <li className="mx-4 inline-block h-6 w-6 align-middle">
            <Link href={`/users/${user.id}/histories`}>
              <a>
                <FontAwesomeIcon
                  icon={faHistory}
                  color="white"
                  className="fa-lg"
                />
              </a>
            </Link>
          </li>
          <li className="inline-block">
            <span onClick={openSidebar}>
              <img
                className="inline-block h-8 w-8 rounded-full bg-white"
                src={user.imageUrl}
              />
            </span>
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

export default function Header({openSidebar}) {
  return (
    <header className="mx-auto flex justify-between bg-primary">
      <div className="my-3 mx-4 float-left">
        <Link href="/">
          <a className="text-white text-3xl">SQUIZ</a>
        </Link>
      </div>

      <div className="my-auto mx-4 float-right">
        <LoginLink openSidebar={openSidebar} />
      </div>
    </header>
  )
}

import Link from 'next/link'
import {faBook} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux'

const LoginLink = ({userState}) => {
  return (
    <div>
      {userState.isLogin ? (
        <ul>
          <li className="mx-4 inline-block h-6 w-6 align-middle">
            <Link href={`/users/${userState.uid}/histories`}>
              <a>
                <FontAwesomeIcon
                  icon={faBook}
                  color="white"
                  className="fa-lg"
                />
              </a>
            </Link>
          </li>
          <li className="inline-block">
            {userState.user && (
              <Link href={`/users/${userState.uid}`}>
                <a>
                  <img
                    className="inline-block h-8 w-8 rounded-full bg-white"
                    src={userState.user.imageUrl}
                  />
                </a>
              </Link>
            )}
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

export function Header({userState}) {
  return (
    <header className="mx-auto flex justify-between bg-primary">
      <div className="my-3 mx-4 float-left">
        <Link href="/">
          <a className="text-white text-3xl">SQUIZ</a>
        </Link>
      </div>

      <div className="my-auto mx-4 float-right">
        <LoginLink userState={userState} />
      </div>
    </header>
  )
}

const mapStateToProps = (state) => {
  return {userState: state}
}

export default connect(mapStateToProps)(Header)

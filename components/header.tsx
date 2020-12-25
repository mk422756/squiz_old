import Link from 'next/link'
import {getIsLogin, getCurrentUser} from '../clients/auth'

export default function Header() {
  const isLogin = getIsLogin()
  const user = getCurrentUser()
  return (
    <header className="bg-gray-100 flow-root">
      <div className="float-left">
        <Link href="/">
          <a>TOP</a>
        </Link>
      </div>

      <div className="float-right">
        {isLogin ? (
          <Link href={`/users/${user?.uid}`}>
            <a>ユーザーページ</a>
          </Link>
        ) : (
          <Link href="/signup">
            <a>新規登録</a>
          </Link>
        )}
      </div>
    </header>
  )
}

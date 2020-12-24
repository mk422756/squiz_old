import Link from 'next/link'
import {getIsLogin} from '../clients/auth'

export default function Header() {
  const isLogin = getIsLogin()
  return (
    <header className="bg-gray-100 flow-root">
      <div className="float-left">
        <Link href="/">
          <a>TOP</a>
        </Link>
        {isLogin ? 'ログイン中' : 'ログアウト中'}
      </div>

      <div className="float-right">
        <Link href="/signup">
          <a>新規登録</a>
        </Link>
      </div>
    </header>
  )
}

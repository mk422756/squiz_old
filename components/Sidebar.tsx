import Link from 'next/link'
import {logout} from 'clients/auth'
import {useRouter} from 'next/router'
import {useRecoilValue} from 'recoil'
import {userState, userIsLoginState} from 'store/userState'

export default function AppSidebar() {
  const router = useRouter()
  const isLogin = useRecoilValue(userIsLoginState)
  const user = useRecoilValue(userState)

  const handleLogout = () => {
    logout()
    // storeLogout()
    router.push('/')
  }

  if (!isLogin) {
    return null
  }

  return (
    <div>
      <div className="p-4">
        <span>
          <img
            className="inline-block h-8 w-8 rounded-full bg-white"
            src={user.imageUrl}
          />
          <span className="ml-2">{user.name}</span>
        </span>
      </div>
      <hr></hr>
      <div className="p-4">
        <p className="my-4 font-semibold">
          <Link href={`/users/${user.id}`}>
            <a>マイページ</a>
          </Link>
        </p>
        <hr></hr>
        <p className="my-4 font-semibold">
          <span onClick={handleLogout}>ログアウト</span>
        </p>
      </div>
    </div>
  )
}

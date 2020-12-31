import {useState, useEffect} from 'react'
import Layout from 'layouts/layout'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {getUser} from 'clients/user'
import {getCurrentUser, logout} from 'clients/auth'
import Image from 'next/image'

export default function UserPage() {
  const [user, setUser] = useState({} as any)
  const [isMyPage, setIsMyPage] = useState(false)
  const router = useRouter()
  const {uid} = router.query

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const user = await getUser(uid as string)
      const currentUser = getCurrentUser()
      if (!unmounted) {
        setUser(user)
        if (user.id === currentUser?.uid) {
          setIsMyPage(true)
        }
      }
    })()

    return () => {
      unmounted = true
    }
  }, [uid])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <Layout>
      <main className="bg-white">
        <div className="p-4 flow-root">
          <div className="h-16 w-16 float-left">
            <Image
              className="rounded-full bg-white"
              src="/user_avatar.png"
              width="120"
              height="120"
              alt="ユーザーイメージ"
            />
          </div>
          <div className="float-left ml-4 mt-2">
            <p className="font-semibold">{user?.name}</p>
          </div>
        </div>
        {isMyPage && (
          <div className="mx-4 my-6 text-blue-400">
            <Link href={`${uid}/edit`}>
              <a>アカウント設定</a>
            </Link>
            <span className="ml-3">
              <Link href={`${uid}/create_collection`}>
                <a>問題集作成</a>
              </Link>
            </span>
            <button className="ml-3" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        )}
        <hr></hr>
      </main>
    </Layout>
  )
}

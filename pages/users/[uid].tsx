import {useState, useEffect} from 'react'
import Head from 'next/head'
import Layout from 'layouts/layout'
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
      <div>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className="m-4 flow-root">
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
              <span>編集</span>
              <span className="ml-3">問題集作成</span>
              <button className="ml-3" onClick={handleLogout}>
                ログアウト
              </button>
            </div>
          )}
          <hr></hr>
        </main>
      </div>
    </Layout>
  )
}

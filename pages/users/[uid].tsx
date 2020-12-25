import {useState, useEffect} from 'react'
import Head from 'next/head'
import Layout from 'layouts/layout'
import {useRouter} from 'next/router'
import {getUser} from 'clients/user'
import {getCurrentUser} from 'clients/auth'

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

  return (
    <Layout>
      <div>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          {user?.name} {isMyPage.toString()}
        </main>
      </div>
    </Layout>
  )
}

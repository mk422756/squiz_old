import React, {useState} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from 'layouts/layout'
import Button from 'components/Button'
import {emailLogin} from 'clients/auth'
import {useRouter} from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const changeEmail = (event) => {
    setEmail(event.target.value)
  }

  const changePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const uid = await emailLogin(email, password)
    router.push(`/users/${uid}`)
  }

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-4 my-8 border rounded">
        <div className="mx-4 my-8 text-center text-2xl font-semibold">
          ログイン
        </div>
        <form className="m-4">
          <div>
            <input
              type="email"
              placeholder="メールアドレス"
              className="p-2 border w-full"
              onChange={changeEmail}
            />
          </div>
          <div className="mt-2">
            <input
              type="password"
              placeholder="パスワード"
              className="p-2 border w-full"
              onChange={changePassword}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">パスワードを忘れた方</div>
          <div className="mt-8 mb-8">
            <Button onClick={handleSubmit} fullWidth={true}>
              ログイン
            </Button>
          </div>
          <hr></hr>
          <div className="mt-8 mb-8">
            <Button fullWidth={true} color="gray">
              <Link href="/signup">
                <a>新規作成</a>
              </Link>
            </Button>
          </div>
        </form>
      </main>
    </Layout>
  )
}

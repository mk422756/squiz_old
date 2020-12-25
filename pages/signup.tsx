import React, {useState} from 'react'
import Layout from 'layouts/layout'
import Button from 'components/Button'
import {emailSignup} from 'clients/auth'
import {createUser} from 'clients/user'
import {useRouter} from 'next/router'

export default function Signup() {
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
    const uid = await emailSignup(email, password)
    await createUser(uid)
    router.push(`/users/${uid}`)
  }

  return (
    <Layout>
      <main className="mx-4 my-8 border rounded bg-white">
        <div className="mx-4 my-8 text-center text-2xl font-semibold">
          新規登録
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
          <div className="mt-8 text-center">
            <label className="">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">
                <span className="text-blue-400">利用規約</span>に同意する
              </span>
            </label>
          </div>
          <div className="mt-8 mb-8">
            <Button onClick={handleSubmit} fullWidth={true}>
              新規登録
            </Button>
          </div>
        </form>
      </main>
    </Layout>
  )
}

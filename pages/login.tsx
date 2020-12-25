import React, {useState} from 'react'
import Head from 'next/head'
import Layout from 'layouts/layout'
import {emailLogin} from 'clients/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const changeEmail = (event) => {
    setEmail(event.target.value)
  }

  const changePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await emailLogin(email, password)
  }

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              メールアドレス:
              <input type="text" onChange={changeEmail} />
            </label>
          </div>
          <div>
            <label>
              パスワード:
              <input type="password" onChange={changePassword} />
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </main>
    </Layout>
  )
}

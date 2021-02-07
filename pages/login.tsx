import React, {useState} from 'react'
import Layout from 'layouts/layout'
import Button from 'components/Button'
import {emailLogin, googleLogin} from 'clients/auth'
import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import {getErrorMessage} from 'utils/firebaseErrors'
import {useRecoilState} from 'recoil'
import {loginInfoState} from 'store/loginInfoState'
import GoogleButton from 'react-google-button'

export default function Login() {
  const router = useRouter()
  const {register, handleSubmit, errors} = useForm()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loginInfo, setLoginInfo] = useRecoilState(loginInfoState)

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onSubmit = async () => {
    try {
      const uid = await emailLogin(email, password)
      if (loginInfo && loginInfo.urlAfterLogin) {
        router.push(loginInfo.urlAfterLogin)
        setLoginInfo(null)
      } else {
        router.push(`/users/${uid}`)
      }
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const onSubmitGoogleLogin = async () => {
    try {
      await googleLogin()
    } catch (e) {
      console.log(e)
      setError(getErrorMessage(e))
    }
  }

  const toSignup = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    router.push(`/signup`)
  }

  return (
    <Layout>
      <div className="bg-white h-screen relative mx-auto">
        <main className="border  rounded absolute inset-x-0 my-8 mx-auto  max-w-md">
          <div className="mx-4 my-10 text-center text-2xl font-semibold">
            ログイン
          </div>
          <GoogleButton
            type="light" // can be light or dark
            onClick={onSubmitGoogleLogin}
            className="mx-auto my-8 w-screen"
          />

          <form className="mt-12 m-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="メールアドレス"
                className="p-2 border w-full"
                onChange={changeEmail}
                ref={register({
                  required: 'メールアドレスが入力されていません',
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: 'メールアドレスが正しくありません',
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-400 text-sm">
                  {errors.email && errors.email.message}
                </span>
              )}
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                placeholder="パスワード"
                className="p-2 border w-full"
                onChange={changePassword}
                ref={register({
                  required: 'パスワードが入力されていません',
                })}
              />
              {errors.password && (
                <span className="text-red-400 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              {error && <span className="text-red-400 text-sm">{error}</span>}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              パスワードを忘れた方
            </div>
            <div className="mt-8 mb-8">
              <Button onClick={handleSubmit(onSubmit)} fullWidth={true}>
                ログイン
              </Button>
            </div>
            <hr></hr>
            <div className="mt-8 mb-8">
              <Button onClick={toSignup} fullWidth={true} color="gray">
                新規作成
              </Button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  )
}

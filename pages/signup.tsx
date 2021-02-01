import React, {useState} from 'react'
import Layout from 'layouts/layout'
import Button from 'components/Button'
import {emailSignup} from 'clients/auth'
import {createUser} from 'clients/user'
import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import {getErrorMessage} from 'utils/firebaseErrors'

export default function Signup() {
  const {register, handleSubmit, errors} = useForm()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [error, setError] = useState('')

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onSubmit = async () => {
    try {
      const uid = await emailSignup(email, password)
      if (!uid) {
        setError('新規登録に失敗しました')
        return
      }
      await createUser(uid)
      router.push(`/users/${uid}`)
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <Layout>
      <div className="bg-white h-screen relative">
        <main className="border rounded absolute inset-x-0 my-8 mx-4">
          <div className="mx-4 my-8 text-center text-2xl font-semibold">
            新規登録
          </div>
          <form className="m-4">
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
                  minLength: {
                    value: 8,
                    message: 'パスワードは8文字以上で入力してください',
                  },
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
            <div className="mt-8 text-center">
              <label className="">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">
                  <span className="text-blue-400">利用規約</span>に同意する
                </span>
              </label>
            </div>
            <div className="mt-8 mb-8">
              <Button onClick={handleSubmit(onSubmit)} fullWidth={true}>
                新規登録
              </Button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  )
}

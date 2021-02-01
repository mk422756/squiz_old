import {useState, useEffect} from 'react'
import Layout from 'layouts/layout'
import Button from 'components/Button'
import {useRouter} from 'next/router'
import {updateUser} from 'clients/user'
import {getCurrentUser} from 'clients/auth'
import {useForm} from 'react-hook-form'
import ImageCrop from 'components/ImageCrop'
import {useUser} from 'hooks/user'

export default function CreateCollectionPage() {
  const {register, handleSubmit, errors} = useForm()
  const router = useRouter()
  const {uid} = router.query
  const user = useUser(uid as string)
  if (!user) {
    return <div>now loading</div>
  }
  const [name, setName] = useState<string>(user.name)
  const [description, setDescription] = useState<string>(user.description || '')
  const [twitterId, setTwitterId] = useState<string>(user.twitterId || '')
  const [facebookId, setFacebookId] = useState<string>(user.facebookId || '')
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const changeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const changeTwitterId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTwitterId(event.target.value)
  }

  const changeFacebookId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFacebookId(event.target.value)
  }

  const onSubmit = async () => {
    const user = getCurrentUser()
    if (!user) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    await updateUser(
      user.uid,
      name,
      description,
      twitterId,
      facebookId,
      imageBlob || undefined
    )
    router.push(`/users/${user.uid}`)
  }

  // useEffect(() => {
  //   let unmounted = false

  //   ;(async () => {
  //     const user = await getUser(uid as string)
  //     if (!unmounted) {
  //       setName(user.name)
  //       setDescription(user.description || '')
  //       setTwitterId(user.twitterId || '')
  //       setFacebookId(user.facebookId || '')
  //     }
  //   })()

  //   return () => {
  //     unmounted = true
  //   }
  // }, [uid])

  return (
    <Layout>
      <main className="p-4 bg-white">
        <div className="my-4 text-center text-lg font-semibold">
          アカウント設定
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold">ユーザー名</label>
          <input
            type="text"
            name="name"
            className="p-2 border w-full"
            onChange={changeName}
            value={name}
            ref={register({
              required: 'ユーザー名が入力されていません',
              maxLength: {
                value: 20,
                message: 'ユーザー名は20文字まで使用できます',
              },
            })}
          />
          {errors.name && (
            <span className="text-red-400 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="mt-2">
          <ImageCrop setImageBlob={setImageBlob}></ImageCrop>
        </div>
        <div className="mt-2">
          <label className="text-sm font-semibold">自己紹介</label>
          <textarea
            name="description"
            className="p-2 border w-full"
            rows={4}
            onChange={changeDescription as any}
            value={description}
            ref={register({
              maxLength: {
                value: 1000,
                message: '自己紹介は1000文字まで使用できます',
              },
            })}
          />
          {errors.description && (
            <span className="text-red-400 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold">Twitter ID</label>
          <input
            type="text"
            name="twitter"
            className="p-2 border w-full"
            onChange={changeTwitterId}
            value={twitterId}
            ref={register({
              maxLength: {
                value: 255,
                message: '入力項目が不正です',
              },
            })}
          />
          {errors.twitter && (
            <span className="text-red-400 text-sm">
              {errors.twitter.message}
            </span>
          )}
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold">Facebook ID</label>
          <input
            type="text"
            name="facebook"
            className="p-2 border w-full"
            onChange={changeFacebookId}
            value={facebookId}
            ref={register({
              maxLength: {
                value: 255,
                message: '入力項目が不正です',
              },
            })}
          />
          <span className="text-xs text-gray-400">
            https://www.facebook.com/のあとにつづくアカウント名を入れてください
          </span>
          {errors.facebook && (
            <span className="text-red-400 text-sm">
              {errors.facebook.message}
            </span>
          )}
        </div>
        <div className="text-center my-8">
          <Button onClick={handleSubmit(onSubmit)} fullWidth={true}>
            保存
          </Button>
        </div>
      </main>
    </Layout>
  )
}

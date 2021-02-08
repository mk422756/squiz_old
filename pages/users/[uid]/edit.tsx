import {useState, useEffect} from 'react'
import Layout from 'layouts/layout'
import Button from 'components/Button'
import {useForm} from 'react-hook-form'
import ImageCrop from 'components/ImageCrop'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'
import MaxStringLength from 'components/MaxStringLength'
import {useRouter} from 'next/router'
import {updateUser} from 'clients/user'
import Link from 'next/link'

type FormValues = {
  name: string
  description: string
  twitterId: string
  facebookId: string
}

export default function CreateCollectionPage() {
  const router = useRouter()
  const {register, handleSubmit, reset, errors, watch} = useForm<FormValues>()
  const user = useRecoilValue(userState)
  if (!user) {
    return <div>now loading</div>
  }
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      if (!unmounted) {
        reset({
          name: user.name,
          description: user.description,
          twitterId: user.twitterId,
          facebookId: user.facebookId,
        })
      }
    })()

    return () => {
      unmounted = true
    }
  }, [user])

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    await updateUser(
      user.id,
      data.name,
      data.description,
      data.twitterId,
      data.facebookId,
      imageBlob || undefined
    )
    router.push(`/users/${user.id}`)
  }

  const nameLength = watch('name')?.length
  const descriptionLength = watch('description')?.length
  const twitterIdLength = watch('twitterId')?.length
  const facebookIdLength = watch('facebookId')?.length

  return (
    <Layout>
      <main className="p-4 bg-white">
        <div>
          <Link href={`/users/${user.id}`}>
            <a className="text-primary">◀︎戻る</a>
          </Link>
        </div>
        <div className="my-4 text-center text-lg font-semibold">
          アカウント設定
        </div>

        <form>
          <div className="mt-4">
            <label className="text-sm font-semibold">ユーザー名</label>
            <input
              type="text"
              name="name"
              className="p-2 border w-full"
              ref={register({
                required: 'ユーザー名が入力されていません',
                maxLength: {
                  value: 20,
                  message: 'ユーザー名は20文字まで使用できます',
                },
              })}
            />
            <div className="float-right">
              <MaxStringLength max={20} current={nameLength}></MaxStringLength>
            </div>
            {errors.name && (
              <span className="text-red-400 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mt-4">
            <ImageCrop setImageBlob={setImageBlob}></ImageCrop>
            {user.imageUrl && !imageBlob && (
              <div className="my-4">
                <img src={user.imageUrl}></img>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold">自己紹介</label>
            <textarea
              name="description"
              className="p-2 border w-full"
              rows={4}
              ref={register({
                maxLength: {
                  value: 1000,
                  message: '自己紹介は1000文字まで使用できます',
                },
              })}
            />
            <div className="float-right">
              <MaxStringLength
                max={1000}
                current={descriptionLength}
              ></MaxStringLength>
            </div>
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
              name="twitterId"
              className="p-2 border w-full"
              ref={register({
                maxLength: {
                  value: 50,
                  message: '入力項目が不正です',
                },
              })}
            />
            <div className="float-right">
              <MaxStringLength
                max={50}
                current={twitterIdLength}
              ></MaxStringLength>
            </div>
            {errors.twitterId && (
              <span className="text-red-400 text-sm">
                {errors.twitterId.message}
              </span>
            )}
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold">Facebook ID</label>
            <input
              type="text"
              name="facebookId"
              className="p-2 border w-full"
              ref={register({
                maxLength: {
                  value: 50,
                  message: '入力項目が不正です',
                },
              })}
            />
            <div className="float-right">
              <MaxStringLength
                max={50}
                current={facebookIdLength}
              ></MaxStringLength>
            </div>
            <div className="text-xs text-gray-400 mt-5">
              https://www.facebook.com/のあとにつづくアカウント名を入力してください
            </div>
            {errors.facebookId && (
              <span className="text-red-400 text-sm">
                {errors.facebookId.message}
              </span>
            )}
          </div>
          <div className="text-center my-8">
            <Button onClick={handleSubmit(onSubmit)} fullWidth={true}>
              保存
            </Button>
          </div>
        </form>
      </main>
    </Layout>
  )
}

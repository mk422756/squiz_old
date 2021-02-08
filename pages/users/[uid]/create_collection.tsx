import Layout from 'layouts/layout'
import Button from 'components/Button'
import {useRouter} from 'next/router'
import {createCollection} from 'clients/collection'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'
import {useForm} from 'react-hook-form'
import MaxStringLength from 'components/MaxStringLength'

type FormValues = {
  title: string
  description: string
}

export default function CreateCollectionPage() {
  const user = useRecoilValue(userState)
  if (!user) {
    return <div>now loading</div>
  }
  const {register, handleSubmit, errors, watch} = useForm<FormValues>()
  const router = useRouter()

  const create = async (value: FormValues) => {
    if (!user) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    const collectionId = await createCollection(
      value.title,
      value.description,
      user.id
    )
    router.push(`/collections/${collectionId}`)
  }

  const titleLength = watch('title')?.length
  const descriptionLength = watch('description')?.length

  return (
    <Layout>
      <main className="p-4 bg-white">
        {/* TODO 画像の挿入 */}
        <div className="my-4 text-center text-lg font-semibold">問題集作成</div>
        <label className="block">
          <span className="text-sm font-semibold">タイトル</span>
          <input
            type="text"
            className="p-2 border w-full"
            name="title"
            ref={register({
              required: 'タイトルが入力されていません',
              maxLength: {
                value: 50,
                message: 'タイトルは50文字まで使用できます',
              },
            })}
          />
        </label>
        <div className="float-right">
          <MaxStringLength max={50} current={titleLength}></MaxStringLength>
        </div>
        {errors.title && (
          <span className="text-red-400 text-sm">{errors.title.message}</span>
        )}
        <label className="block mt-2">
          <span className="text-sm font-semibold">説明</span>
          <textarea
            className="p-2 border w-full"
            rows={6}
            name="description"
            ref={register({
              maxLength: {
                value: 1000,
                message: '説明は1000文字まで使用できます',
              },
            })}
          />
        </label>
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
        <div className="my-4 text-center">
          <Button onClick={handleSubmit(create)}>作成</Button>
        </div>
      </main>
    </Layout>
  )
}

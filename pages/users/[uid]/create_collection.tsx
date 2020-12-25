import {useState} from 'react'
import Layout from 'layouts/layout'
import Button from 'components/Button'
import {useRouter} from 'next/router'
import {createCollection} from 'clients/collection'
import {getCurrentUser} from 'clients/auth'

export default function CreateCollectionPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const changeTitle = (event) => {
    setTitle(event.target.value)
  }

  const changeDescription = (event) => {
    setDescription(event.target.value)
  }

  const create = async () => {
    const user = getCurrentUser()
    if (!user) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    const collectionId = await createCollection(title, description, user.uid)
    router.push(`/collections/${collectionId}`)
  }

  return (
    <Layout>
      <main className="m-4">
        {/* TODO 画像の挿入 */}
        <label className="block">
          <span>タイトル</span>
          <input
            type="text"
            className="p-2 border w-full"
            onChange={changeTitle}
          />
        </label>
        <label className="block mt-2">
          <span>説明</span>
          <textarea
            className="p-2 border w-full"
            onChange={changeDescription}
          />
        </label>
        <div className="my-4 text-center">
          <Button onClick={create}>作成</Button>
        </div>
      </main>
    </Layout>
  )
}

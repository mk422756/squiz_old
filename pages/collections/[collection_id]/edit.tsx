import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {getCollection, updateCollection} from 'clients/collection'
import {getCurrentUser} from 'clients/auth'
import Button from 'components/Button'

export default function CollectionEditPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const router = useRouter()
  const {collection_id} = router.query

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const collection = await getCollection(collection_id as string)
      if (!unmounted) {
        setTitle(collection.title)
        setDescription(collection.description)
        setIsPublic(collection.isPublic)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collection_id])

  const onChangeTitle = (event) => {
    setTitle(event.target.value)
  }

  const onChangeDescription = (event) => {
    setDescription(event.target.value)
  }

  const onChangePublic = (event) => {
    const publicity = event.target.value === 'true' ? true : false
    setIsPublic(publicity)
  }

  const update = async () => {
    const currentUser = getCurrentUser()
    if (!currentUser.uid) {
    }
    await updateCollection(
      collection_id as string,
      title,
      description,
      currentUser.uid,
      isPublic
    )
    router.push(`/collections/${collection_id as string}`)
  }
  return (
    <Layout>
      <main className="p-4 bg-white">
        <div className="my-2">
          <label>
            <span>タイトル</span>
            <input
              type="text"
              value={title}
              onChange={onChangeTitle}
              className="p-2 border w-full"
            />
          </label>
        </div>
        <div className="my-2">
          <label>
            <span>説明</span>
            <textarea
              value={description}
              onChange={onChangeDescription}
              className="p-2 border w-full"
            />
          </label>
        </div>
        <div className="my-2">
          <p>公開</p>
          <label>
            <input
              type="radio"
              name="public"
              value="true"
              onChange={onChangePublic}
              checked={isPublic}
            />
            <span>公開する</span>
          </label>
          <label className="ml-2">
            <input
              type="radio"
              name="public"
              value="false"
              onChange={onChangePublic}
              checked={!isPublic}
            />
            <span>公開しない</span>
          </label>
        </div>
        <div className="my-4 text-center">
          <Button onClick={update}>更新</Button>
        </div>
      </main>
    </Layout>
  )
}

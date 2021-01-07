import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {useCollection} from 'hooks/collection'
import {updateCollection} from 'clients/collection'
import {getCurrentUser} from 'clients/auth'
import Button from 'components/Button'
import ImageCrop from 'components/ImageCrop'

const MAX_TAG_COUNT = 5

export default function CollectionEditPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState([])
  const [imageBlob, setImageBlob] = useState<Blob>(null)
  const router = useRouter()
  const {collection_id} = router.query
  const collection = useCollection(collection_id as string)

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      if (!unmounted) {
        setTitle(collection.title)
        setDescription(collection.description)
        setIsPublic(collection.isPublic)
        setTags(collection.tags)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collection])

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

  const onChangeTag = (event) => {
    setTag(event.target.value)
  }

  const onClickPushTags = () => {
    if (!tag || tags.length >= MAX_TAG_COUNT) {
      return
    }
    setTags([...tags, tag])
    setTag('')
  }

  const onClickDeteteTags = (event) => {
    tags.splice(event.target.id, 1)
    setTags([...tags])
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
      isPublic,
      tags,
      imageBlob
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
          <span>タグ</span>
          <div className="w-full">
            <input
              type="text"
              className="p-2 border"
              value={tag}
              onChange={onChangeTag}
            />
            <Button mx={4} onClick={onClickPushTags}>
              +
            </Button>
          </div>
          <div>
            {tags.map((tag, index) => {
              return (
                <div
                  key={index}
                  className="ml-1 mt-2 text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
                >
                  {tag}
                  <button
                    className="px-1"
                    id={index.toString()}
                    onClick={onClickDeteteTags}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-2 p-2">
          <ImageCrop setImageBlob={setImageBlob}></ImageCrop>
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

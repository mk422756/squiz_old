import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {useCollection} from 'hooks/collection'
import {updateCollection} from 'clients/collection'
import Button from 'components/Button'
import ImageCrop from 'components/ImageCrop'
import {useForm} from 'react-hook-form'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'

const MAX_TAG_COUNT = 5

type FormValues = {
  title: string
  description: string
  isPublic: string
  needPayment: string
  price?: number
}

export default function CollectionEditPage() {
  const user = useRecoilValue(userState)

  const [tag, setTag] = useState('')
  const [tags, setTags] = useState([])
  const [imageBlob, setImageBlob] = useState<Blob>(null)
  const router = useRouter()
  const {collection_id} = router.query
  const collection = useCollection(collection_id as string)

  const {register, handleSubmit, watch, errors, reset} = useForm<FormValues>()

  const needPayment = watch('needPayment', 'false') === 'true'

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      if (!unmounted) {
        setTags(collection.tags)
        reset({
          title: collection.title,
          description: collection.description,
          isPublic: String(collection.isPublic),
          needPayment: String(collection.needPayment),
          price: collection.price,
        })
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collection])

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

  const back = (event) => {
    event.preventDefault()
    router.push(`/collections/${collection_id as string}`)
  }

  const update = async (data: FormValues) => {
    if (!user.id) {
      return
    }
    await updateCollection(
      collection_id as string,
      data.title,
      data.description,
      user.id,
      data.isPublic === 'true',
      data.needPayment === 'true',
      Number(data.price) || 100,
      tags,
      imageBlob
    )
    router.push(`/collections/${collection_id as string}`)
  }
  return (
    <Layout>
      <main className="p-4 bg-white">
        <form onSubmit={handleSubmit(update)}>
          <div className="my-2">
            <label>
              <span>タイトル</span>
              <input
                type="text"
                className="p-2 border w-full"
                name="title"
                ref={register({required: true})}
              />
            </label>
          </div>
          <div className="my-2">
            <label>
              <span>説明</span>
              <textarea
                className="p-2 border w-full"
                name="description"
                ref={register()}
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
                name="isPublic"
                value="false"
                ref={register()}
              />
              <span>公開しない</span>
            </label>
            <label className="ml-2">
              <input
                type="radio"
                name="isPublic"
                value="true"
                ref={register()}
              />
              <span>公開する</span>
            </label>
          </div>
          <div className="my-2">
            <p>有料問題</p>
            <label>
              <input
                type="radio"
                name="needPayment"
                value="false"
                ref={register()}
              />
              <span>無料</span>
            </label>
            <label className="ml-2">
              <input
                type="radio"
                name="needPayment"
                value="true"
                ref={register()}
              />
              <span>有料</span>
            </label>
          </div>
          {needPayment && (
            <div className="my-2">
              <label>
                <span>価格</span>
                <input
                  type="number"
                  defaultValue={100}
                  className="p-2 border w-full"
                  name="price"
                  min={100}
                  ref={register({required: true})}
                />
              </label>
            </div>
          )}
          <div className="my-4 text-center">
            <Button>
              <input
                type="submit"
                value="更新"
                className="bg-primary font-semibold"
              />
            </Button>
            <span className="ml-2">
              <Button color="gray" onClick={back}>
                キャンセル
              </Button>
            </span>
          </div>
        </form>
      </main>
    </Layout>
  )
}

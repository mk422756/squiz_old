import {useEffect} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {updateSection} from 'clients/section'
import {useCollection} from 'hooks/collection'
import {useSection} from 'hooks/section'
import {useForm} from 'react-hook-form'
import Button from 'components/Button'

type FormValues = {
  title: string
  isFree?: boolean
}

export default function SectionEditPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
  } = useForm<FormValues>()

  const router = useRouter()
  const {collection_id, section_id} = router.query
  const collectionId = collection_id as string
  const sectionId = section_id as string
  const collection = useCollection(collectionId)
  const section = useSection(collectionId, sectionId)

  useEffect(() => {
    setValue('title', section.title)
    setValue('isFree', section.isFree)
  }, [section])

  const onSubmit = async (data: FormValues) => {
    const isFree = !!data.isFree
    await updateSection(collectionId, sectionId, data.title, isFree)
    router.push(`/collections/${collectionId}/sections/${sectionId}`)
  }

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white">
          <Link
            href={`/collections/${section.collectionId}/sections/${section.id}`}
          >
            <a className="text-blue-400 text-sm">◀︎戻る</a>
          </Link>
          <form className="mt-4">
            <div>
              <label>
                <span className="font-semibold">タイトル</span>
                <input
                  name="title"
                  ref={register}
                  className="p-2 border block w-full"
                />
              </label>
            </div>
            {collection.needPayment && (
              <div className="mt-3">
                <label>
                  <span className="font-semibold">無料公開する</span>
                  <input type="checkbox" name="isFree" ref={register} />
                </label>
              </div>
            )}
            <div className="mt-2">
              <Button onClick={handleSubmit(onSubmit)}>更新</Button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  )
}

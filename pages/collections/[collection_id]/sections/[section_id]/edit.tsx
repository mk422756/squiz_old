import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {updateSection} from 'clients/section'
import {useSection} from 'hooks/section'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'
import {useForm} from 'react-hook-form'
import Button from 'components/Button'

type FormValues = {
  title: string
}

export default function SectionEditPage() {
  const {register, handleSubmit, watch, errors} = useForm<FormValues>()

  const user = useRecoilValue(userState)
  const router = useRouter()
  const {collection_id, section_id} = router.query
  const collectionId = collection_id as string
  const sectionId = section_id as string
  const section = useSection(collectionId, sectionId)

  const onSubmit = async (data: FormValues) => {
    await updateSection(collectionId, sectionId, data.title)
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
            <label>
              <span>タイトル</span>
              <input
                name="title"
                defaultValue={section.title}
                ref={register}
                className="p-2 border block w-full"
              />
            </label>
            <div className="mt-2">
              <Button onClick={handleSubmit(onSubmit)}>更新</Button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  )
}

import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {deleteSection} from 'clients/section'
import {getQuizzes, deleteQuiz} from 'clients/quiz'
import {dateToYYYYMMDD} from 'utils/dateUtils'
import {useSection} from 'hooks/section'
import {useQuizzes} from 'hooks/quiz'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'

export default function CollectionPage() {
  const user = useRecoilValue(userState)

  const router = useRouter()
  const {collection_id, section_id} = router.query
  const collectionId = collection_id as string
  const sectionId = section_id as string
  const section = useSection(collectionId, sectionId)
  const [quizzes, setQuizzes] = useQuizzes(collectionId, sectionId)

  const isMySection = user && user.id === section.creatorId

  async function _deleteSection() {
    if (
      confirm(
        'セクションを削除します。セクションに含まれる全ての問題も削除されます。本当によろしいですか？'
      )
    ) {
      await deleteSection(collection_id as string, section_id as string)
      router.push(`/collections/${collection_id}`)
    }
  }

  async function _deleteQuiz(event: React.ChangeEvent<HTMLInputElement>) {
    if (confirm('問題を削除します。よろしいですか？')) {
      await deleteQuiz(
        collection_id as string,
        section_id as string,
        event.target.id
      )
      await reloadQuiz()
    }
  }

  async function reloadQuiz() {
    const quizzes = await getQuizzes(
      collection_id as string,
      section_id as string
    )
    setQuizzes(quizzes)
  }

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white">
          <Link href={`/collections/${section.collectionId}`}>
            <a className="text-blue-400 text-sm">◀︎問題集に戻る</a>
          </Link>
          <h1 className="text-2xl font-semibold mt-4">{section.title}</h1>
          <div className="pt-4 text-sm font-semibold">
            合計 {quizzes.length} 問
          </div>
          <div className="text-xs text-gray-500">
            {/* TODO セクション更新の最新を取得する */}
            最終更新日 {dateToYYYYMMDD(section.updatedAt)}
          </div>

          {section.isFree && (
            <div className="mt-4 text-red-400 font-semibold">
              無料公開セクション
            </div>
          )}

          {isMySection && (
            <div className="pt-4">
              <Link
                href={`/collections/${section.collectionId}/sections/${section.id}/quizzes/create`}
              >
                <a className="underline text-gray-400">問題作成</a>
              </Link>
              <Link
                href={`/collections/${section.collectionId}/sections/${section.id}/edit`}
              >
                <a className="underline text-gray-400 ml-2">編集</a>
              </Link>
              <button
                type="button"
                className="mx-2 underline text-gray-400"
                onClick={_deleteSection}
              >
                削除
              </button>
            </div>
          )}
        </div>
        <div className="p-4 mt-2 bg-white">
          <p className="font-semibold">問題一覧</p>
          <ul className="mt-4">
            {quizzes.map((quiz, index) => (
              <li key={quiz.id} className="mt-1">
                <Link
                  href={`/collections/${section.collectionId}/sections/${section.id}/quizzes/${quiz.id}/edit`}
                >
                  <a>
                    問題{index + 1}
                    <span className="ml-2 break-words">{quiz.question}</span>
                  </a>
                </Link>

                <span
                  className="float-right"
                  id={quiz.id}
                  onClick={_deleteQuiz as any}
                >
                  削除
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  )
}

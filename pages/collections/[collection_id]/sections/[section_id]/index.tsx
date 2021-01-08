import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getSection} from 'clients/section'
import {getQuizzes} from 'clients/quiz'
import {getCurrentUser} from 'clients/auth'
import {dateToYYYYMMDD} from 'utils/dateUtils'

export default function CollectionPage() {
  const [isMySection, setIsMySection] = useState(false)
  const [section, setSection] = useState({
    id: '',
    title: '',
    collectionId: '',
    creatorId: '',
    updatedAt: new Date(),
  })
  const [quizzes, setQuizzes] = useState([])
  const router = useRouter()
  const {collection_id, section_id} = router.query

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const [section, quizzes] = await Promise.all([
        getSection(collection_id as string, section_id as string),
        getQuizzes(collection_id as string, section_id as string),
      ])
      const currentUser = getCurrentUser()
      if (!unmounted) {
        setSection(section)
        setQuizzes(quizzes)
        if (section.creatorId === currentUser?.uid) {
          setIsMySection(true)
        }
      }
    })()

    return () => {
      unmounted = true
    }
    // TODO 二回取得しに行ってしまうので一度にまとめる
  }, [collection_id, section_id])

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white">
          <h1 className="text-2xl font-semibold">{section.title}</h1>
          {/* TODO 合計問題数を実装する */}
          <div className="pt-4 text-sm font-semibold">
            合計 {quizzes.length} 問
          </div>
          <div className="text-xs text-gray-500">
            {/* TODO セクション更新の最新を取得する */}
            最終更新日 {dateToYYYYMMDD(section.updatedAt)}
          </div>

          {isMySection && (
            <div className="pt-4">
              <Link
                href={`/collections/${section.collectionId}/sections/${section.id}/create_quiz`}
              >
                <a className="underline text-gray-400">問題作成</a>
              </Link>
              <Link href={`/collections/${section.collectionId}/edit`}>
                <a className="underline text-gray-400 ml-2">編集</a>
              </Link>
              <button
                type="button"
                className="mx-2 underline text-gray-400"
                onClick={async () => {
                  if (window.confirm('This will be deleted')) {
                    // TODO 削除処理
                    router.push('/collections')
                  }
                }}
              >
                削除
              </button>
            </div>
          )}
          <div id="modal"></div>
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
                    <span className="ml-2">{quiz.question}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  )
}

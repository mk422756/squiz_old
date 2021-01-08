import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {updateQuiz} from 'clients/quiz'
import QuizEditForm, {Outputs} from 'components/QuizEditForm'
import {useQuiz} from 'hooks/quiz'

export default function CollectionPage() {
  const router = useRouter()
  const {collection_id, section_id, quiz_id} = router.query
  const quiz = useQuiz(
    collection_id as string,
    section_id as string,
    quiz_id as string
  )

  const edit = async (outputs: Outputs) => {
    await updateQuiz(
      quiz_id as string,
      outputs.question,
      outputs.answers,
      outputs.correctAnswerIndex,
      outputs.explanation,
      collection_id as string,
      section_id as string
    )
    router.push(`/collections/${collection_id}/sections/${section_id}`)
  }

  return (
    <Layout>
      <main className="p-4 bg-white">
        <p className="text-lg font-semibold">問題編集</p>
        <QuizEditForm
          submit={edit}
          submitLabel="更新"
          quiz={quiz}
        ></QuizEditForm>
      </main>
    </Layout>
  )
}

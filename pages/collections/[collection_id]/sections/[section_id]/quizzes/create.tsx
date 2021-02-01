import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {createQuiz} from 'clients/quiz'
import QuizEditForm, {Outputs} from 'components/QuizEditForm'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'

export default function CreateQuizPage() {
  const user = useRecoilValue(userState)
  const router = useRouter()
  const {collection_id, section_id} = router.query

  if (!user) {
    return <div>now loading</div>
  }

  const create = async (outputs: Outputs) => {
    await createQuiz(
      outputs.question,
      outputs.answers,
      outputs.correctAnswerIndex,
      outputs.explanation,
      collection_id as string,
      section_id as string,
      user.id
    )
    router.push(`/collections/${collection_id}/sections/${section_id}`)
  }

  return (
    <Layout>
      <main className="p-4 bg-white">
        <p className="text-lg font-semibold">問題作成</p>
        <QuizEditForm submitLabel="作成" submit={create}></QuizEditForm>
      </main>
    </Layout>
  )
}

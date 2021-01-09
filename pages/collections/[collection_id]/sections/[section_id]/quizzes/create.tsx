import {useState} from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {createQuiz} from 'clients/quiz'
import QuizEditForm, {Outputs} from 'components/QuizEditForm'
import {connect} from 'react-redux'

function CreateQuizPage({userState}) {
  const router = useRouter()
  const {collection_id, section_id} = router.query

  const create = async (outputs: Outputs) => {
    if (!userState.uid) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    await createQuiz(
      outputs.question,
      outputs.answers,
      outputs.correctAnswerIndex,
      outputs.explanation,
      collection_id as string,
      section_id as string,
      userState.uid
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

const mapStateToProps = (state) => {
  return {userState: state}
}

export default connect(mapStateToProps)(CreateQuizPage)

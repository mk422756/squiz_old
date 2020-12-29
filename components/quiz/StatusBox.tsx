import React from 'react'
import {useRouter} from 'next/router'
import {Quiz} from 'models/quiz'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

type StatusBoxProps = {
  quizzes: Quiz[]
  collectionId: string
  collectionTitle: string
  sectionTitle: string
  currentQuizIndex: number
}

const StatusBox = ({
  quizzes,
  collectionTitle,
  collectionId,
  sectionTitle,
  currentQuizIndex,
}: StatusBoxProps) => {
  const router = useRouter()

  const close = () => {
    if (window.confirm('問題を終了します。よろしいですか？')) {
      router.push(`/collections/${collectionId}`)
    }
  }

  return (
    <div className="p-4 bg-white">
      <div className="grid grid-cols-7">
        <div>
          <button className="inline-block h-8 w-8 align-middle" onClick={close}>
            <FontAwesomeIcon
              icon={faTimesCircle}
              color="grey"
              className="fa-lg"
            />
          </button>
        </div>
        <div className="col-span-6 break-words">
          <p className="text-sm font-semibold">{collectionTitle}</p>
          <p className="text-sm">{sectionTitle}</p>
        </div>
      </div>

      <div className="pt-2 grid grid-cols-7">
        <div className="text-xs my-auto">
          {currentQuizIndex + 1}/{quizzes.length}
        </div>
        {/* TODO プログレスバーを実装する */}
        <div className="col-span-6 bg-accent h-7 rounded"></div>
      </div>
    </div>
  )
}

export default StatusBox

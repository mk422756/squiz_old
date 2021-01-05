import Link from 'next/link'
import {History} from 'models/history'
import {calculateCorrectRate} from 'utils/calculateUtils'
import ResultPieChart from 'components/ResultPieChart'
import Button from 'components/Button'

type Props = {
  history: History
}

const HistoryTile = ({history}: Props) => {
  const correctPercent =
    calculateCorrectRate(history.quizCount, history.correctCount) * 100
  const unanswerdCount =
    history.quizCount - (history.correctCount + history.incorrectCount)
  return (
    <div className="bg-white p-4">
      <div className="break-normal">
        <Link href={`/collections/${history.collectionId}`}>
          <span className="text-xg font-semibold break-all">
            {history.collectionTitle} {history.sectionTitle}
          </span>
        </Link>
        <div className="my-2 flex justify-between">
          <div className="w-1/3 p-2 ">
            <div className="mb-2">正解率 {correctPercent}%</div>
            <ResultPieChart
              correctCount={history.correctCount}
              incorrectCount={history.incorrectCount}
              unanswerdCount={unanswerdCount}
            />
          </div>
          <div className="p-2 w-2/3 my-auto">
            <Button fullWidth={true}>間違った問題だけ再挑戦</Button>
            <p className="text-primary text-center mt-2">全問再挑戦</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryTile

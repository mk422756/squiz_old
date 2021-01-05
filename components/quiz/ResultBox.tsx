import Result from 'models/result'
import Results from 'models/results'
import ResultPieChart from 'components/ResultPieChart'
type ResultReviewBoxProps = {
  result: Result
  index: number
}

const ResultReviewBox = ({result, index}: ResultReviewBoxProps) => {
  return (
    <div className="my-2 p-4 bg-white flow-root">
      <span className="text-lg font-semibold">問題{index}</span>
      <p className="my-2">{result.quiz.question}</p>
      {result.isCorrect ? (
        <div>
          <span className="text-green-400">○</span>
          <span className="ml-2">
            {result.quiz.answers[result.answerIndex[0]]}
          </span>
        </div>
      ) : (
        <div>
          <span className="text-red-400">×</span>
          <span className="ml-2">
            {result.quiz.answers[result.answerIndex[0]]}
          </span>
        </div>
      )}
      {/* <p className="text-primary float-right">詳細</p> */}
    </div>
  )
}

type ResultBoxProps = {
  results: Results
  collectionId: string
  quizCount: number
}

const ResultBox = ({results, collectionId, quizCount}: ResultBoxProps) => {
  const unanswerdCount = quizCount - results.length
  return (
    <div>
      <div className="my-2 p-4 bg-white">
        <h2 className="text-lg font-semibold">回答スコア</h2>
        <div className="flow-root">
          <div className="float-left w-1/2 p-4">
            <ResultPieChart
              correctCount={results.correctCount}
              incorrectCount={results.incorrectCount}
              unanswerdCount={unanswerdCount}
            />
          </div>
          <div className="float-left ml-4">
            <p className="text-lg font-semibold">
              正解率 {results.correctRate * 100} %
            </p>
            <p className="text-sm mt-1">問題数 : {quizCount}</p>
            <p className="text-sm mt-1">正解 : {results.correctCount}</p>
            <p className="text-sm mt-1">不正解 : {results.incorrectCount}</p>
            <p className="text-sm mt-1">未回答 : {unanswerdCount}</p>
          </div>
        </div>
      </div>
      <div>
        {results.value.map((result, i) => {
          return (
            <ResultReviewBox
              result={result}
              index={i + 1}
              key={i}
            ></ResultReviewBox>
          )
        })}
      </div>
    </div>
  )
}

export default ResultBox

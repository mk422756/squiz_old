import {useState} from 'react'
import Result from 'models/result'
import Results from 'models/results'
import ResultPieChart from 'components/ResultPieChart'
type ResultReviewBoxProps = {
  result: Result
  index: number
}

const ResultReviewBox = ({result, index}: ResultReviewBoxProps) => {
  const [showDetail, setShowDetail] = useState(false)
  const onChangeShowDetail = () => {
    console.log('detail')
    setShowDetail((detail) => !detail)
  }
  return (
    <div className="my-2 p-4 bg-white flow-root">
      <span className="text-lg font-semibold">問題{index}</span>
      <pre className="my-2 whitespace-pre-wrap">{result.quiz.question}</pre>
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
      <p className="text-primary float-right" onClick={onChangeShowDetail}>
        ▼詳細
      </p>
      {showDetail && (
        <div className="pt-8">
          <div>
            {result.quiz.answers.map((answer, index) => {
              const isSelectedAnswer = result.answerIndex.includes(index)
              const correctAnswer = result.quiz.correctAnswerIndex.includes(
                index
              )
              let className = 'p-2 border rounded mt-2'
              if (correctAnswer) {
                className += ' bg-green-100'
              } else if (!result.isCorrect && isSelectedAnswer) {
                className += ' bg-red-100'
              }
              return <div className={className}>{answer}</div>
            })}
          </div>
          <pre className="my-8 whitespace-pre-wrap">
            {result.quiz.explanation}
          </pre>
          <p className="text-primary float-right" onClick={onChangeShowDetail}>
            ▲閉じる
          </p>
        </div>
      )}
    </div>
  )
}

type ResultBoxProps = {
  results: Results
  quizCount: number
}

const ResultBox = ({results, quizCount}: ResultBoxProps) => {
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

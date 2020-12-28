import Result from 'models/result'
import Results from 'models/results'

type ResultReviewBoxProps = {
  result: Result
}

const ResultReviewlBox = ({result}: ResultReviewBoxProps) => {
  return (
    <div className="my-2 p-2 bg-white">
      <p>{result.quiz.question}</p>
      <p>{result.isCorrect ? '正解' : '不正解'}</p>
      <p>あなたの回答:{result.quiz.answers[result.answerIndex[0]]}</p>
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
      <div className="my-2 p-2 bg-white">
        <h2 className="text-lg">回答スコア</h2>
        <p className="text-lg">正解率 {results.correctRate * 100} %</p>
        <p>問題数 {quizCount}</p>
        <p>正解 {results.correctCount}</p>
        <p>不正解 {results.incorrectCount}</p>
        <p>未回答 {unanswerdCount}</p>
      </div>
      <div>
        {results.value.map((result, i) => {
          return <ResultReviewlBox result={result} key={i}></ResultReviewlBox>
        })}
      </div>
    </div>
  )
}

export default ResultBox

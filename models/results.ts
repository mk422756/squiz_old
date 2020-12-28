import Result from 'models/result'

export default class Results {
  readonly value: Result[]

  constructor(results: Result[]) {
    this.value = results
  }

  push(result: Result) {
    return new Results([...this.value, result])
  }

  get correctRate(): number {
    const rate =
      this.value
        .map((result) => {
          return result.isCorrect
        })
        .filter((isCorrect) => {
          return isCorrect
        }).length / this.value.length

    const roundedRate = Math.round(rate * 100) / 100
    return roundedRate
  }

  get correctCount(): number {
    return this.value.filter((result) => result.isCorrect).length
  }

  get incorrectCount(): number {
    return this.value.filter((result) => !result.isCorrect).length
  }

  get length(): number {
    return this.value.length
  }
}

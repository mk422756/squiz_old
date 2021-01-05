import Result from 'models/result'
import {calculateCorrectRate} from 'utils/calculateUtils'

export default class Results {
  readonly value: Result[]

  constructor(results: Result[]) {
    this.value = results
  }

  push(result: Result) {
    return new Results([...this.value, result])
  }

  get correctRate(): number {
    const correctCount = this.value.filter((result) => {
      return result.isCorrect
    }).length

    return calculateCorrectRate(this.value.length, correctCount)
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

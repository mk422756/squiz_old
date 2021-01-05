import {calculateCorrectRate} from './calculateUtils'

describe('calculateCorrectRate', () => {
  it('正しく計算されるか', () => {
    expect(calculateCorrectRate(3, 0)).toEqual(0)
    expect(calculateCorrectRate(3, 1)).toEqual(0.33)
    expect(calculateCorrectRate(3, 2)).toEqual(0.67)
    expect(calculateCorrectRate(3, 3)).toEqual(1)
  })
})

import {nullableArray2NonullableArray} from './array'

describe('nullableArray2NonullableArray', () => {
  it('正しくnullが消えるか', () => {
    const array1 = [1, null, 2, null, 3]
    const array2 = [null, 'a', null, 'b', 'c', null]
    const array3 = [null, null, null]
    expect(nullableArray2NonullableArray(array1)).toEqual([1, 2, 3])
    expect(nullableArray2NonullableArray(array2)).toEqual(['a', 'b', 'c'])
    expect(nullableArray2NonullableArray(array3)).toEqual([])
  })
})

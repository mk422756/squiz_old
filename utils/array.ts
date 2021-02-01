export function nullableArray2NonullableArray<T>(arr: (T | null)[]) {
  return arr.reduce((prev, current) => {
    if (current) {
      return prev.concat(current)
    }
    return prev
  }, Array<T>())
}

export const getIndexes = (spans: Array<Array<number>>, index: number): [number, number] => {
  const flattened = spans.reduce((a, s) => a.concat(s), [])

  if (index < 0 || index > flattened.length) throw new RangeError()

  let remainder = index
  let rowIndex = 0

  while (rowIndex < spans.length - 1 && remainder >= spans[rowIndex].length) {
    remainder -= spans[rowIndex].length
    rowIndex += 1
  }

  return [rowIndex, remainder]
}

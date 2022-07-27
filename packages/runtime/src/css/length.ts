/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/length
 *
 * @todos
 * - Add additional units
 * - Rename `value` field to `amount` or a more descriptive name representative of the "distance"
 *   represented by a CSS length
 */
export type LengthData = { value: number; unit: 'px' } | string | number

export function lengthDataToString(data: LengthData): string {
  if (typeof data === 'object') return `${data.value}${data.unit}`

  if (typeof data === 'number') return `${data}px`

  return data
}

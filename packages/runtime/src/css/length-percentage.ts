import type { LengthData } from './length'

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/percentage */
export type PercentageData = { value: number; unit: '%' }

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage */
export type LengthPercentageData = LengthData | PercentageData | number | string

export function lengthPercentageDataToString(data: LengthPercentageData): string {
  if (typeof data === 'object') return `${data.value}${data.unit}`

  if (typeof data === 'number') return `${data}px`

  return data
}

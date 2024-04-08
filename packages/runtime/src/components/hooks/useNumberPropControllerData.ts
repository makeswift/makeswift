import { NumberPropControllerData } from '@makeswift/prop-controllers'
import { getNumberPropControllerDataNumber } from '@makeswift/prop-controllers'

export function useNumberPropControllerData(
  data: NumberPropControllerData | undefined,
): number | undefined {
  if (data == null) return data

  return getNumberPropControllerDataNumber(data)
}

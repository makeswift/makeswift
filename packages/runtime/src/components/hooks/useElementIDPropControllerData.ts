import {
  ElementIDPropControllerData,
  getElementIDPropControllerDataElementID,
} from '@makeswift/prop-controllers'

export function useElementIDPropControllerData(
  data: ElementIDPropControllerData | undefined,
): string | undefined {
  if (data == null) return data

  return getElementIDPropControllerDataElementID(data)
}

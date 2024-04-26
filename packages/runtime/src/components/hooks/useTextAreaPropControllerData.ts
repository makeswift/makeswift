import {
  TextAreaPropControllerData,
  getTextAreaPropControllerDataString,
} from '@makeswift/prop-controllers'

export function useTextAreaPropControllerData(
  data: TextAreaPropControllerData | undefined,
): string | undefined {
  if (data == null) return data

  return getTextAreaPropControllerDataString(data)
}

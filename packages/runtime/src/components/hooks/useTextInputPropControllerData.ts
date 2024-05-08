import {
  TextInputPropControllerData,
  getTextInputPropControllerDataString,
} from '@makeswift/prop-controllers'

export function useTextInputPropControllerData(
  data: TextInputPropControllerData | undefined,
): string | undefined {
  return getTextInputPropControllerDataString(data)
}

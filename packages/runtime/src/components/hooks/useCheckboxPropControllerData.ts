import {
  CheckboxPropControllerData,
  getCheckboxPropControllerDataBoolean,
} from '@makeswift/prop-controllers'

export function useCheckboxPropControllerData(
  data: CheckboxPropControllerData | undefined,
): boolean | undefined {
  if (data == null) return data

  return getCheckboxPropControllerDataBoolean(data)
}

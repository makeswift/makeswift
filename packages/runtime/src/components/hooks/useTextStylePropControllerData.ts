import {
  ResponsiveTextStyleData,
  TextStylePropControllerData,
  getTextStylePropControllerDataResponsiveTextStyleData,
} from '@makeswift/prop-controllers'

export function useTextStylePropControllerData(
  data: TextStylePropControllerData | undefined,
): ResponsiveTextStyleData | undefined {
  if (data == null) return data

  return getTextStylePropControllerDataResponsiveTextStyleData(data)
}

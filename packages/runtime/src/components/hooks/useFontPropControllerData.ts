import {
  FontPropControllerData,
  ResponsiveFontData,
  getFontPropControllerDataResponsiveFontData,
} from '@makeswift/prop-controllers'

export function useFontPropControllerData(
  data: FontPropControllerData | undefined,
): ResponsiveFontData | undefined {
  if (data == null) return data

  return getFontPropControllerDataResponsiveFontData(data)
}

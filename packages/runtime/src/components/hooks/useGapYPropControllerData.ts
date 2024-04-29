import {
  GapYPropControllerData,
  ResponsiveGapData,
  getGapYPropControllerDataResponsiveGapData,
} from '@makeswift/prop-controllers'

export function useGapYPropControllerData(
  data: GapYPropControllerData | undefined,
): ResponsiveGapData | undefined {
  if (data == null) return data

  return getGapYPropControllerDataResponsiveGapData(data)
}

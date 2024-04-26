import {
  GapXPropControllerData,
  ResponsiveGapData,
  getGapXPropControllerDataResponsiveGapData,
} from '@makeswift/prop-controllers'

export function useGapXPropControllerData(
  data: GapXPropControllerData | undefined,
): ResponsiveGapData | undefined {
  if (data == null) return data

  return getGapXPropControllerDataResponsiveGapData(data)
}

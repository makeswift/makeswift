import {
  ResponsiveLengthData,
  ResponsiveLengthPropControllerData,
  getResponsiveLengthPropControllerDataResponsiveLengthData,
} from '@makeswift/prop-controllers'

export function useResponsiveLengthPropControllerData(
  data: ResponsiveLengthPropControllerData | undefined | null,
): ResponsiveLengthData | undefined | null {
  if (data == null) return data

  return getResponsiveLengthPropControllerDataResponsiveLengthData(data)
}

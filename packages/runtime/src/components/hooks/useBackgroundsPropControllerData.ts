import {
  ResponsiveBackgroundsData,
  BackgroundsPropControllerData,
  getBackgroundsPropControllerDataResponsiveBackgroundsData,
} from '@makeswift/prop-controllers'

export function useBackgroundsPropControllerData(
  data: BackgroundsPropControllerData | undefined,
): ResponsiveBackgroundsData | undefined {
  return getBackgroundsPropControllerDataResponsiveBackgroundsData(data)
}

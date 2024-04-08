import {
  ResponsiveColorPropControllerData,
  ResponsiveValue,
  getResponsiveColorPropControllerDataResponsiveColorData,
} from '@makeswift/prop-controllers'
import { ColorValue } from '../utils/types'
import { useResponsiveColor } from './useResponsiveColor'

export function useResponsiveColorPropControllerData(
  data: ResponsiveColorPropControllerData | null | undefined,
): ResponsiveValue<ColorValue> | null | undefined {
  const responsiveColorData =
    data == null ? data : getResponsiveColorPropControllerDataResponsiveColorData(data)

  return useResponsiveColor(responsiveColorData)
}

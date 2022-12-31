import { Length as LengthValue } from '../../../../../../../../prop-controllers'
import { ColorValue as Color } from '../../../../../../../utils/types'
import { findDeviceOverride } from '../../../../../../../utils/devices'
import type { DeviceOverride } from '../../../../../../../../prop-controllers'
import {
  useSwatches,
  useTypography,
} from '../../../../../../../../runtimes/react/hooks/makeswift-api'
import { Swatch, Typography } from '../../../../../../../../api'
import { getTypographyStyleSwatchIds } from '../../../../../../../../prop-controllers/introspection'
import { isNonNullable } from '../../../../../../../utils/isNonNullable'

export type TypographyMarkDataValue = {
  fontWeight?: number
  fontSize?: LengthValue
  fontFamily?: string
  color?: Color
  textAlign?: string
  lineHeight?: number
  letterSpacing?: number
  uppercase?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

export type TypographyMarkValue = {
  id: string | null | undefined
  style: Typography['style']
}

export type TypographyMarkData = Array<DeviceOverride<TypographyMarkDataValue>>

const getDeviceId = ({ deviceId }: DeviceOverride<unknown>) => deviceId

const withColor =
  (swatches: Swatch[]) =>
  ({
    value: { color, ...restOfValue },
    ...rest
  }: Typography['style'][number]): DeviceOverride<TypographyMarkDataValue> =>
    ({
      ...rest,
      value: {
        ...restOfValue,
        ...(color
          ? {
              color: {
                swatch: swatches.find(s => s && s.id === color.swatchId),
                alpha: color.alpha,
              },
            }
          : {}),
      } as TypographyMarkDataValue,
    } as DeviceOverride<TypographyMarkDataValue>)

export const overrideTypographyStyle = <A>(
  source: Array<DeviceOverride<A>>,
  override: Array<DeviceOverride<A>>,
): Array<DeviceOverride<A>> => {
  const devices = [...new Set(source.map(getDeviceId).concat(override.map(getDeviceId)))]

  return devices.map(deviceId => ({
    deviceId,
    value: {
      ...(findDeviceOverride(source, deviceId) || { value: {} }).value,
      ...(findDeviceOverride(override, deviceId, v => v) || { value: {} }).value,
    },
  })) as DeviceOverride<A>[]
}

export default function useTypographyMark(
  value: TypographyMarkValue | null | undefined,
): TypographyMarkData | null | undefined {
  const typography = useTypography(value?.id ?? null)
  const swatchIds = [
    ...getTypographyStyleSwatchIds(value?.style),
    ...getTypographyStyleSwatchIds(typography?.style),
  ]
  const swatches = useSwatches(swatchIds)

  return overrideTypographyStyle(
    typography?.style.map(withColor(swatches.filter(isNonNullable))) ?? [],
    value?.style.map(withColor(swatches.filter(isNonNullable))) ?? [],
  )
}

import { Length as LengthValue } from '../../../../../../../../prop-controllers'
import { ColorValue as Color } from '../../../../../../../utils/types'
import { findDeviceOverride } from '../../../../../../../utils/devices'
import type { DeviceOverride } from '../../../../../../../../prop-controllers'
import { SWATCHES_BY_ID } from '../../../../../../../utils/queries'
import { useTypography, TypographyStyle } from '../../../../../../../hooks/useTypography'
import { useQuery } from '../../../../../../../../api/react'

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
  style: TypographyStyle
}

export type TypographyMarkData = Array<DeviceOverride<TypographyMarkDataValue>>

const concat = <A extends unknown[], B extends unknown[]>(a: A, b: B) => a.concat(b)
const getSwatchId = ({ value: { color } }: any) => color && color.swatchId
const getDeviceId = ({ deviceId }: any) => deviceId

const withColor =
  (swatches: any) =>
  ({ value: { color, ...restOfValue }, ...rest }: any) => ({
    ...rest,
    value: {
      ...restOfValue,
      ...(color
        ? {
            color: {
              swatch: swatches.find((s: any) => s && s.id === color.swatchId),
              alpha: color.alpha,
            },
          }
        : {}),
    },
  })

export const overrideTypographyStyle = <A>(
  source: Array<DeviceOverride<A>>,
  override: Array<DeviceOverride<A>>,
): Array<DeviceOverride<A>> => {
  const devices = [...new Set(source.map(getDeviceId).concat(override.map(getDeviceId)))]

  return devices.map((deviceId: any) => ({
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
  const typography = useTypography(value && value.id)

  const swatchIds = [
    (typography && typography.style.map(getSwatchId)) || [],
    (value && value.style.map(getSwatchId)) || [],
  ]
    .reduce(concat)
    .filter(Boolean)

  const { error: colorError, data: colorData = {} } = useQuery(SWATCHES_BY_ID, {
    skip: swatchIds == null || swatchIds.length === 0,
    variables: { ids: swatchIds },
  })

  const { swatches = [] } = colorData

  if (colorError != null) return null

  return overrideTypographyStyle(
    (typography && typography.style.map(withColor(swatches))) || [],
    (value && value.style.map(withColor(swatches))) || [],
  )
}

import { CSSObject } from '@emotion/serialize'
import {
  unstable_TypographyDefinition,
  findBreakpointOverride,
  shallowMergeFallbacks,
  type DataType,
  type Breakpoints,
  type DeviceOverride,
  type ResponsiveValue,
} from '@makeswift/controls'

import { useSwatches, useTypography } from '../hooks/makeswift-api'
import { Typography, Swatch } from '../../../api'
import { colorToString } from '../../../components/utils/colorToString'
import { responsiveStyle } from '../../../components/utils/responsive-style'
import { ColorValue } from '../../../components/utils/types'
import { isNonNullable } from '../../../utils/isNonNullable'
import { useStyle } from '../use-style'
import { useBreakpoints } from '../hooks/use-breakpoints'

export function typographyFragementToTypographyControlData(
  fragment: Typography | null,
): DataType<unstable_TypographyDefinition> | undefined {
  if (fragment == null) return undefined
  return {
    id: fragment.id,
    style: fragment.style.map(({ deviceId, value }) => ({
      deviceId,
      value: {
        fontFamily: value.fontFamily ?? undefined,
        lineHeight: value.lineHeight ?? undefined,
        letterSpacing: value.letterSpacing ?? undefined,
        fontWeight: value.fontWeight ?? undefined,
        textAlign: value.textAlign ?? undefined,
        uppercase: value.uppercase ?? undefined,
        underline: value.underline ?? undefined,
        strikethrough: value.strikethrough ?? undefined,
        italic: value.italic ?? undefined,
        fontSize: value.fontSize ?? undefined,
        color: value.color ?? undefined,
      },
    })),
  }
}

type EnhancedColor = {
  color?: ColorValue
}

export type TypographyControlDataValue = Exclude<
  DataType<unstable_TypographyDefinition>,
  undefined
>['style'][number]['value']

type EnhancedTypographyValue = Omit<TypographyControlDataValue, keyof EnhancedColor> & EnhancedColor

export type EnhancedTypography = Array<DeviceOverride<EnhancedTypographyValue>>

export function getTypographyStyleSwatchIds(
  style:
    | Exclude<DataType<unstable_TypographyDefinition>, undefined>['style']
    | Typography['style']
    | null
    | undefined,
): string[] {
  return (
    style
      ?.map(override => override.value)
      .flatMap(typographyStyle => typographyStyle.color?.swatchId)
      .filter(isNonNullable) ?? []
  )
}

const withColor =
  (swatches: Swatch[]) =>
  (
    deviceRawTypographyValue: DeviceOverride<TypographyControlDataValue>,
  ): DeviceOverride<EnhancedTypographyValue> => {
    const { value, deviceId } = deviceRawTypographyValue

    if (value.color == null) {
      const { color, ...nextValue } = value
      return {
        deviceId,
        value: nextValue,
      }
    }
    return {
      deviceId,
      value: {
        ...value,
        color: {
          swatch: swatches.find(s => s && s.id === value.color?.swatchId),
          alpha: value.color?.alpha ?? undefined,
        },
      },
    }
  }

const getDeviceId = ({ deviceId }: DeviceOverride<unknown>) => deviceId

/**
 * `enhanced` here just means typography ids have been replaced with the related entity.
 */
export default function useEnhancedTypography(
  data?: DataType<unstable_TypographyDefinition> | null,
): EnhancedTypography {
  const typography = typographyFragementToTypographyControlData(useTypography(data?.id ?? null))
  const source = typography?.style ?? []
  const override = data?.style ?? []
  const breakpoints = useBreakpoints()

  const swatchIds = [
    ...getTypographyStyleSwatchIds(data?.style),
    ...getTypographyStyleSwatchIds(typography?.style),
  ]
  const swatches = useSwatches(swatchIds).filter(isNonNullable)

  const enhancedSource = source.map(withColor(swatches))
  const enhancedOverride = override.map(withColor(swatches))

  const devices = [
    ...new Set(enhancedSource.map(getDeviceId).concat(enhancedOverride.map(getDeviceId))),
  ]

  return devices
    .map(deviceId => {
      const deviceSource = findBreakpointOverride(breakpoints, enhancedSource, deviceId)?.value
      const deviceOverride = findBreakpointOverride(
        breakpoints,
        enhancedOverride,
        deviceId,
        v => v,
      )?.value

      if (deviceSource && deviceOverride) {
        return {
          deviceId,
          value: { ...deviceSource, ...deviceOverride },
        }
      } else if (deviceOverride) {
        return {
          deviceId,
          value: deviceOverride,
        }
      } else if (deviceSource) {
        return {
          deviceId,
          value: deviceSource,
        }
      }
      return null
    })
    .filter(isNonNullable)
}

function typographyToCssObject(value: EnhancedTypographyValue): CSSObject {
  let styles: CSSObject = {}
  if (value.color != null) styles.color = colorToString(value.color)
  if (value.fontFamily != null) styles.fontFamily = value.fontFamily
  if (value.fontSize != null && value.fontSize.value != null && value.fontSize.unit != null)
    styles.fontSize = `${value.fontSize.value}${value.fontSize.unit}`
  if (value.fontWeight != null) styles.fontWeight = value.fontWeight
  if (value.lineHeight != null) styles.lineHeight = value.lineHeight
  if (value.letterSpacing != null) styles.letterSpacing = `${value.letterSpacing / 10}em`
  if (value.uppercase != null)
    styles.textTransform = value.uppercase === true ? 'uppercase' : 'initial'
  if (value.underline != null || value.strikethrough != null)
    styles.textDecoration = [
      Boolean(value.underline) && 'underline',
      Boolean(value.strikethrough) && 'line-through',
    ]
      .filter(Boolean)
      .join(' ')
  if (value.italic != null) styles.fontStyle = value.italic === true ? 'italic' : 'initial'

  return styles
}

export function typographyCss(breakpoints: Breakpoints, style: EnhancedTypography): CSSObject {
  return responsiveStyle<
    EnhancedTypographyValue,
    [ResponsiveValue<EnhancedTypographyValue> | null | undefined]
  >(
    breakpoints,
    [style],
    ([value]) => (value !== undefined ? typographyToCssObject(value) : {}),
    shallowMergeFallbacks,
  )
}

export function useTypographyClassName(value: EnhancedTypography): string {
  const breakpoints = useBreakpoints()
  return useStyle(typographyCss(breakpoints, value))
}

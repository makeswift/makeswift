import { CSSObject } from '@emotion/serialize'
import { unstable_TypographyDefinition, type DataType } from '@makeswift/controls'

import { useSwatches, useTypography } from '../hooks/makeswift-api'
import { Typography, Swatch } from '../../../api'
import { colorToString } from '../../../components/utils/colorToString'
import { useResponsiveStyle } from '../../../components/utils/responsive-style'
import { ColorValue } from '../../../components/utils/types'
import { DeviceOverride, ResponsiveValue } from '../../../prop-controllers'
import { findBreakpointOverride, shallowMergeFallbacks } from '../../../state/modules/breakpoints'
import { isNonNullable } from '../../../utils/isNonNullable'
import { useStyle } from '../use-style'
import { useBreakpoints } from '../hooks/use-breakpoints'

export function typographyFragementToTypographyControlData(
  typography: Typography | null,
): DataType<unstable_TypographyDefinition> | undefined {
  if (typography == null) return undefined
  return {
    id: typography.id,
    style: typography.style.map(({ deviceId, value }) => ({
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
  value?: DataType<unstable_TypographyDefinition> | null,
): EnhancedTypography {
  const typography = typographyFragementToTypographyControlData(useTypography(value?.id ?? null))
  const source = typography?.style ?? []
  const override = value?.style ?? []
  const breakpoints = useBreakpoints()

  const swatchIds = [
    ...getTypographyStyleSwatchIds(value?.style),
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

export function useTypographyClassName(value: EnhancedTypography): string {
  return useStyle(
    useResponsiveStyle<
      EnhancedTypographyValue,
      [ResponsiveValue<EnhancedTypographyValue> | null | undefined]
    >(
      [value],
      ([value]) => {
        if (value === undefined) return {}

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
      },
      shallowMergeFallbacks,
    ),
  )
}

export type TypographyControlValue = string

export function useTypographyValue(
  data: DataType<unstable_TypographyDefinition> | undefined,
): TypographyControlValue {
  // for each breakpoint fetch related resources and merge its value with its override
  const enhancedTypography = useEnhancedTypography(data)

  // for each breakpoint shallow merge back up through the breakpoints and create a className
  return useTypographyClassName(enhancedTypography)
}

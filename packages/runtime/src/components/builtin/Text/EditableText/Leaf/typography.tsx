import { CSSObject } from '@emotion/serialize'
import { ReactNode } from 'react'
import { Swatch, Typography as TypographyDTO } from '../../../../../api'
import { DeviceOverride, ResponsiveValue } from '../../../../../prop-controllers'
import { getTypographyStyleSwatchIds } from '../../../../../prop-controllers/introspection'
import { useTypography, useSwatches } from '../../../../../runtimes/react/hooks/makeswift-api'
import { useStyle } from '../../../../../runtimes/react/use-style'
import { colorToString } from '../../../../utils/colorToString'
import { findDeviceOverride, shallowMergeFallbacks } from '../../../../utils/devices'
import { isNonNullable } from '../../../../utils/isNonNullable'
import { responsiveStyle } from '../../../../utils/responsive-style'
import { ColorValue } from '../../../../utils/types'

type TypographyValue = TypographyDTO['style'][number]['value']

export type Typography = {
  id: string | null | undefined
  style: TypographyDTO['style']
}

type EnhancedTypographyValue = {
  fontFamily: string | null
  lineHeight: number | null
  letterSpacing: number | null
  fontWeight: number | null
  textAlign: string | null
  uppercase: boolean | null
  underline: boolean | null
  strikethrough: boolean | null
  italic: boolean | null
  fontSize: { value: number | null; unit: string | null } | null
  color: ColorValue | null
}

export type EnhancedTypography = Array<DeviceOverride<EnhancedTypographyValue>>

export function isDeviceOverride(
  value: TypographyDTO['style'][number],
): value is DeviceOverride<TypographyValue> {
  return value.deviceId === 'desktop' || value.deviceId === 'tablet' || value.deviceId === 'mobile'
}

const withColor =
  (swatches: Swatch[]) =>
  (
    deviceRawTypographyValue: DeviceOverride<TypographyValue>,
  ): DeviceOverride<EnhancedTypographyValue> => {
    const { value, deviceId } = deviceRawTypographyValue

    if (value.color == null) {
      return {
        deviceId,
        value: {
          ...value,
          color: null,
        },
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

export default function useEnhancedTypography(value: Typography): EnhancedTypography {
  const typography = useTypography(value?.id ?? null)
  const source = typography?.style.filter(isDeviceOverride) ?? []
  const override = value?.style.filter(isDeviceOverride) ?? []

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
      const deviceSource = findDeviceOverride(enhancedSource, deviceId)?.value
      const deviceOverride = findDeviceOverride(enhancedOverride, deviceId)?.value

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
    responsiveStyle<
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

export type TypographyLeafProps = {
  typography: Typography
  children: ReactNode
}

export function TypographyLeaf({ typography, children, ...props }: TypographyLeafProps) {
  const enhancedTypography = useEnhancedTypography(typography)
  const typographyClassName = useTypographyClassName(enhancedTypography)
  return (
    <span {...props} className={typographyClassName}>
      {children}
    </span>
  )
}

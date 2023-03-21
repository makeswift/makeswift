import { CSSObject } from '@emotion/serialize'
import { RenderLeafProps, useFocused } from 'slate-react'
import { Swatch, Typography } from '../../../../../api'
import { TypographyText } from '../../../../../controls'
import { DeviceOverride, ResponsiveValue } from '../../../../../prop-controllers'
import { getTypographyStyleSwatchIds } from '../../../../../prop-controllers/introspection'
import { useTypography, useSwatches } from '../../../../../runtimes/react/hooks/makeswift-api'
import { useStyle } from '../../../../../runtimes/react/use-style'
import { colorToString } from '../../../../utils/colorToString'
import { findDeviceOverride, shallowMergeFallbacks } from '../../../../utils/devices'
import { isNonNullable } from '../../../../utils/isNonNullable'
import { responsiveStyle } from '../../../../utils/responsive-style'
import { ColorValue } from '../../../../utils/types'

export type TypographyValue = Typography['style'][number]['value']

type EnhancedColor = {
  color?: ColorValue
}

type EnhancedTypographyValue = Omit<TypographyValue, keyof EnhancedColor> & EnhancedColor

export type EnhancedTypography = Array<DeviceOverride<EnhancedTypographyValue>>

export function isDeviceOverride(value: {
  deviceId: string
  value: TypographyValue
}): value is DeviceOverride<TypographyValue> {
  return value.deviceId === 'desktop' || value.deviceId === 'tablet' || value.deviceId === 'mobile'
}

const withColor =
  (swatches: Swatch[]) =>
  (
    deviceRawTypographyValue: DeviceOverride<TypographyValue>,
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

export interface TypographyRenderLeafProps extends RenderLeafProps {
  leaf: TypographyText
}

export function TypographyLeaf({ leaf, children, attributes }: TypographyRenderLeafProps) {
  const enhancedTypography = useEnhancedTypography(leaf.typography)
  const typographyClassName = useTypographyClassName(enhancedTypography)

  return (
    <span
      {...attributes}
      className={typographyClassName}
      style={leaf.selected ? { background: 'rgba(0,0,0,.1)' } : {}}
    >
      {children}
    </span>
  )
}

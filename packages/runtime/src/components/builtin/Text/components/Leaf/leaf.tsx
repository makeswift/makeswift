import { RenderLeafProps } from 'slate-react'
import { CSSObject } from '@emotion/serialize'
import { Swatch, Typography } from '../../../../../api'
import { DeviceOverride, ResponsiveValue } from '../../../../../prop-controllers'
import { useTypography, useSwatches } from '../../../../../runtimes/react/hooks/makeswift-api'
import { useStyle } from '../../../../../runtimes/react/use-style'
import { colorToString } from '../../../../utils/colorToString'
import { isNonNullable } from '../../../../utils/isNonNullable'
import { useResponsiveStyle } from '../../../../utils/responsive-style'
import { ColorValue } from '../../../../utils/types'
import {
  findBreakpointOverride,
  shallowMergeFallbacks,
} from '../../../../../state/modules/breakpoints'
import { useBreakpoints } from '../../../../../runtimes/react'
import { RichTextTypography } from '../../../../../../types/slate'

export type RichTextTypographyValue = RichTextTypography['style'][number]['value']

function typographyFragementToRichTextTypography(
  typography: Typography | null,
): RichTextTypography | undefined {
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

type EnhancedTypographyValue = Omit<RichTextTypographyValue, keyof EnhancedColor> & EnhancedColor

export type EnhancedTypography = Array<DeviceOverride<EnhancedTypographyValue>>

export function getTypographyStyleSwatchIds(
  style: RichTextTypography['style'] | Typography['style'] | null | undefined,
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
    deviceRawTypographyValue: DeviceOverride<RichTextTypographyValue>,
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
export default function useEnhancedTypography(value?: RichTextTypography): EnhancedTypography {
  const typography = typographyFragementToRichTextTypography(useTypography(value?.id ?? null))
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
      const deviceOverride = findBreakpointOverride(breakpoints, enhancedOverride, deviceId)?.value

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

export function Leaf({ leaf, ...props }: RenderLeafProps) {
  const enhancedTypography = useEnhancedTypography(leaf.typography)
  const typographyClassName = useTypographyClassName(enhancedTypography)

  return (
    <span {...props.attributes} className={typographyClassName}>
      {props.children}
    </span>
  )
}

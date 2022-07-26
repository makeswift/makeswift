import * as React from 'react'
import { css, cache, CSSObject } from '@emotion/css'
import { serializeStyles } from '@emotion/serialize'
import { insertStyles } from '@emotion/utils'

import { useBorder, BorderSide } from '../../../components/hooks'
import { colorToString } from '../../../components/utils/colorToString'
import { responsiveStyle } from '../../../components/utils/responsive-style'

import {
  BorderRadiusLonghandPropertyData,
  FontSizePropertyData,
  MarginLonghandPropertyData,
  PaddingLonghandPropertyData,
  StyleControlData,
  StyleControlDefinition,
  StyleControlProperty,
  WidthPropertyData,
} from '../../../controls'

function useStyleControlCssObject(
  style: StyleControlData | undefined,
  controlDefinition: StyleControlDefinition,
): CSSObject {
  const { properties } = controlDefinition.config

  return {
    ...(properties.includes(StyleControlProperty.Width) && {
      maxWidth: '100%',
    }),
    ...responsiveStyle(
      [
        style?.width,
        style?.margin,
        style?.padding,
        useBorder(style?.border),
        style?.borderRadius,
        style?.textStyle,
      ] as const,
      ([width, margin, padding, border, borderRadius, textStyle]) => ({
        ...(properties.includes(StyleControlProperty.Width) && {
          width: widthToString(width) ?? '100%',
        }),
        ...(properties.includes(StyleControlProperty.Margin) && {
          marginTop: marginToString(margin?.marginTop) ?? 0,
          marginRight: marginToString(margin?.marginRight) ?? 'auto',
          marginBottom: marginToString(margin?.marginBottom) ?? 0,
          marginLeft: marginToString(margin?.marginLeft) ?? 'auto',
        }),
        ...(properties.includes(StyleControlProperty.Padding) && {
          paddingTop: paddingToString(padding?.paddingTop) ?? 0,
          paddingRight: paddingToString(padding?.paddingRight) ?? 0,
          paddingBottom: paddingToString(padding?.paddingBottom) ?? 0,
          paddingLeft: paddingToString(padding?.paddingLeft) ?? 0,
        }),
        ...(properties.includes(StyleControlProperty.Border) && {
          borderTop: borderSideToString(border?.borderTop) ?? '0 solid black',
          borderRight: borderSideToString(border?.borderRight) ?? '0 solid black',
          borderBottom: borderSideToString(border?.borderBottom) ?? '0 solid black',
          borderLeft: borderSideToString(border?.borderLeft) ?? '0 solid black',
        }),
        ...(properties.includes(StyleControlProperty.BorderRadius) && {
          borderTopLeftRadius: borderRadiusToString(borderRadius?.borderTopLeftRadius) ?? 0,
          borderTopRightRadius: borderRadiusToString(borderRadius?.borderTopRightRadius) ?? 0,
          borderBottomRightRadius: borderRadiusToString(borderRadius?.borderBottomRightRadius) ?? 0,
          borderBottomLeftRadius: borderRadiusToString(borderRadius?.borderBottomLeftRadius) ?? 0,
        }),
        ...(properties.includes(StyleControlProperty.TextStyle) && {
          ...(textStyle?.fontFamily && { fontFamily: textStyle.fontFamily }),
          ...(textStyle?.letterSpacing && { letterSpacing: textStyle.letterSpacing }),
          ...(textStyle?.fontSize && { fontSize: fontSizeToString(textStyle.fontSize) }),
          ...(textStyle?.fontWeight && { fontWeight: textStyle.fontWeight }),
          textTransform: textStyle?.textTransform ?? [],
          fontStyle: textStyle?.fontStyle ?? [],
        }),
      }),
    ),
  }

  function widthToString(widthProperty: WidthPropertyData | undefined): string | null {
    if (widthProperty == null) return null

    return `${widthProperty.value}${widthProperty.unit}`
  }

  function marginToString(
    marginProperty: MarginLonghandPropertyData | null | undefined,
  ): string | null {
    if (marginProperty == null) return null

    if (marginProperty === 'auto') return marginProperty

    return `${marginProperty.value}${marginProperty.unit}`
  }

  function paddingToString(
    paddingProperty: PaddingLonghandPropertyData | null | undefined,
  ): string | null {
    if (paddingProperty == null) return null

    return `${paddingProperty.value}${paddingProperty.unit}`
  }

  function borderSideToString(borderSide: BorderSide | null | undefined): string | null {
    if (borderSide == null) return null

    const { width, color, style } = borderSide
    return `${width != null ? width : 0}px ${style} ${
      color != null ? colorToString(color) : 'black'
    }`
  }

  function borderRadiusToString(
    borderRadius: BorderRadiusLonghandPropertyData | null | undefined,
  ): string | null {
    if (borderRadius == null) return null

    return `${borderRadius.value}${borderRadius.unit}`
  }

  function fontSizeToString(fontSize: NonNullable<FontSizePropertyData>) {
    return `${fontSize.value}${fontSize.unit}`
  }
}

const useInsertionEffectSpecifier = 'useInsertionEffect'
// @ts-expect-error: React types are outdated.
const useInsertionEffect = React[useInsertionEffectSpecifier] ?? React.useLayoutEffect
const isServer = typeof window === 'undefined'

export type StyleControlFormattedValue = string

export function useFormattedStyle(
  styleControlData: StyleControlData | undefined,
  controlDefinition: StyleControlDefinition,
): StyleControlFormattedValue {
  const style = useStyleControlCssObject(styleControlData, controlDefinition)

  if (isServer) return css(style)

  const serialized = serializeStyles([style], cache.registered)

  useInsertionEffect(() => {
    insertStyles(cache, serialized, false)
  })

  return `${cache.key}-${serialized.name}`
}

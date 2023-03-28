import { CSSObject } from '@emotion/css'

import { useBorder, BorderSide } from '../../../components/hooks'
import { colorToString } from '../../../components/utils/colorToString'
import { responsiveStyle } from '../../../components/utils/responsive-style'

import {
  FontSizePropertyData,
  StyleControl,
  StyleControlData,
  StyleControlDefinition,
  StyleControlProperty,
  WidthPropertyData,
} from '../../../controls'
import { useStyle } from '../use-style'
import { BorderRadiusLonghandPropertyData } from '../../../css/border-radius'
import { lengthPercentageDataToString } from '../../../css/length-percentage'
import { marginPropertyDataToStyle } from '../../../css/margin'
import { paddingPropertyDataToStyle } from '../../../css/padding'
import { useEffect } from 'react'
import { pollBoxModel } from '../poll-box-model'

const defaultMargin = {
  marginTop: 0,
  marginRight: 'auto',
  marginBottom: 0,
  marginLeft: 'auto',
}

const defaultPadding = {
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
}

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
        ...(properties.includes(StyleControlProperty.Margin) &&
          marginPropertyDataToStyle(margin ?? defaultMargin, defaultMargin)),
        ...(properties.includes(StyleControlProperty.Padding) &&
          paddingPropertyDataToStyle(padding ?? defaultPadding, defaultPadding)),
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
          ...(textStyle?.fontFamily && { fontFamily: `"${textStyle.fontFamily}"` }),
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

    return lengthPercentageDataToString(widthProperty)
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

    return lengthPercentageDataToString(borderRadius)
  }

  function fontSizeToString(fontSize: NonNullable<FontSizePropertyData>) {
    return `${fontSize.value}${fontSize.unit}`
  }
}

export type StyleControlFormattedValue = string

export function useFormattedStyle(
  styleControlData: StyleControlData | undefined,
  controlDefinition: StyleControlDefinition,
  control: StyleControl | null,
): StyleControlFormattedValue {
  const style = useStyleControlCssObject(styleControlData, controlDefinition)
  const guid = control?.guid
  const className = guid == null ? `${useStyle(style)}` : `${useStyle(style)}-${guid}`

  useEffect(() => {
    const element = document.querySelector(`.${className}`)

    if (element == null || control == null) return

    return pollBoxModel({
      element,
      onBoxModelChange: boxModel => control.changeItemBoxModel(boxModel),
    })
  }, [control, className])

  return useStyle(style)
}

import { CSSObject } from '@emotion/css'
import {
  Style,
  type StyleProperty,
  type FontSizePropertyData,
  type WidthPropertyData,
  type ResolvedStyleData,
} from '@makeswift/controls'

import { type BorderSide } from '../../../components/hooks'
import { colorToString } from '../../../components/utils/colorToString'
import { responsiveStyle } from '../../../components/utils/responsive-style'

import { BorderRadiusLonghandPropertyData } from '../../../css/border-radius'
import { lengthPercentageDataToString } from '../../../css/length-percentage'
import { marginPropertyDataToStyle } from '../../../css/margin'
import { paddingPropertyDataToStyle } from '../../../css/padding'
import { Breakpoints } from '../../../state/modules/breakpoints'

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

export function getStyleControlCssObject(
  breakpoints: Breakpoints,
  style: ResolvedStyleData | undefined,
  properties: StyleProperty[],
): CSSObject {
  return {
    ...(properties.includes(Style.Width) && {
      maxWidth: '100%',
    }),
    ...responsiveStyle(
      breakpoints,
      [
        style?.width,
        style?.margin,
        style?.padding,
        style?.border,
        style?.borderRadius,
        style?.textStyle,
      ] as const,
      ([width, margin, padding, border, borderRadius, textStyle]) => ({
        ...(properties.includes(Style.Width) && {
          width: widthToString(width) ?? '100%',
        }),
        ...(properties.includes(Style.Margin) &&
          marginPropertyDataToStyle(margin ?? defaultMargin, defaultMargin)),
        ...(properties.includes(Style.Padding) &&
          paddingPropertyDataToStyle(padding ?? defaultPadding, defaultPadding)),
        ...(properties.includes(Style.Border) && {
          borderTop: borderSideToString(border?.borderTop) ?? '0 solid black',
          borderRight: borderSideToString(border?.borderRight) ?? '0 solid black',
          borderBottom: borderSideToString(border?.borderBottom) ?? '0 solid black',
          borderLeft: borderSideToString(border?.borderLeft) ?? '0 solid black',
        }),
        ...(properties.includes(Style.BorderRadius) && {
          borderTopLeftRadius: borderRadiusToString(borderRadius?.borderTopLeftRadius) ?? 0,
          borderTopRightRadius: borderRadiusToString(borderRadius?.borderTopRightRadius) ?? 0,
          borderBottomRightRadius: borderRadiusToString(borderRadius?.borderBottomRightRadius) ?? 0,
          borderBottomLeftRadius: borderRadiusToString(borderRadius?.borderBottomLeftRadius) ?? 0,
        }),
        ...(properties.includes(Style.TextStyle) && {
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

// function useStyleControlCssObject(
//   style: DataType<StyleDefinition> | undefined,
//   controlDefinition: StyleDefinition,
// ): CSSObject {
//   const { properties } = controlDefinition.config

//   return {
//     ...(properties.includes(Style.Width) && {
//       maxWidth: '100%',
//     }),
//     ...useResponsiveStyle(
//       [
//         style?.width,
//         style?.margin,
//         style?.padding,
//         useBorder(style?.border),
//         style?.borderRadius,
//         style?.textStyle,
//       ] as const,
//       ([width, margin, padding, border, borderRadius, textStyle]) => ({
//         ...(properties.includes(Style.Width) && {
//           width: widthToString(width) ?? '100%',
//         }),
//         ...(properties.includes(Style.Margin) &&
//           marginPropertyDataToStyle(margin ?? defaultMargin, defaultMargin)),
//         ...(properties.includes(Style.Padding) &&
//           paddingPropertyDataToStyle(padding ?? defaultPadding, defaultPadding)),
//         ...(properties.includes(Style.Border) && {
//           borderTop: borderSideToString(border?.borderTop) ?? '0 solid black',
//           borderRight: borderSideToString(border?.borderRight) ?? '0 solid black',
//           borderBottom: borderSideToString(border?.borderBottom) ?? '0 solid black',
//           borderLeft: borderSideToString(border?.borderLeft) ?? '0 solid black',
//         }),
//         ...(properties.includes(Style.BorderRadius) && {
//           borderTopLeftRadius: borderRadiusToString(borderRadius?.borderTopLeftRadius) ?? 0,
//           borderTopRightRadius: borderRadiusToString(borderRadius?.borderTopRightRadius) ?? 0,
//           borderBottomRightRadius: borderRadiusToString(borderRadius?.borderBottomRightRadius) ?? 0,
//           borderBottomLeftRadius: borderRadiusToString(borderRadius?.borderBottomLeftRadius) ?? 0,
//         }),
//         ...(properties.includes(Style.TextStyle) && {
//           ...(textStyle?.fontFamily && { fontFamily: `"${textStyle.fontFamily}"` }),
//           ...(textStyle?.letterSpacing && { letterSpacing: textStyle.letterSpacing }),
//           ...(textStyle?.fontSize && { fontSize: fontSizeToString(textStyle.fontSize) }),
//           ...(textStyle?.fontWeight && { fontWeight: textStyle.fontWeight }),
//           textTransform: textStyle?.textTransform ?? [],
//           fontStyle: textStyle?.fontStyle ?? [],
//         }),
//       }),
//     ),
//   }

//   function widthToString(widthProperty: WidthPropertyData | undefined): string | null {
//     if (widthProperty == null) return null

//     return lengthPercentageDataToString(widthProperty)
//   }

//   function borderSideToString(borderSide: BorderSide | null | undefined): string | null {
//     if (borderSide == null) return null

//     const { width, color, style } = borderSide
//     return `${width != null ? width : 0}px ${style} ${
//       color != null ? colorToString(color) : 'black'
//     }`
//   }

//   function borderRadiusToString(
//     borderRadius: BorderRadiusLonghandPropertyData | null | undefined,
//   ): string | null {
//     if (borderRadius == null) return null

//     return lengthPercentageDataToString(borderRadius)
//   }

//   function fontSizeToString(fontSize: NonNullable<FontSizePropertyData>) {
//     return `${fontSize.value}${fontSize.unit}`
//   }
// }

// export type StyleControlFormattedValue = string

// export function useFormattedStyle(
//   styleControlData: DataType<StyleDefinition> | undefined,
//   controlDefinition: StyleDefinition,
//   control: StyleControl | null,
// ): StyleControlFormattedValue {
//   const style = useStyleControlCssObject(styleControlData, controlDefinition)
//   // We're removing the colons because useId returns a string wrapped with colons, e.g. ":R3d5sm:",
//   // and we cannot use colons in a class name.
//   const guid = useId().replaceAll(':', '')
//   const styleClassName = useStyle(style)
//   const classNames = `${styleClassName} ${guid}`

//   useEffect(() => {
//     if (control == null) return

//     const element = document.querySelector(`.${guid}`)
//     return pollBoxModel({
//       element,
//       onBoxModelChange: boxModel => control.changeBoxModel(boxModel),
//     })
//   }, [guid, control])

//   return classNames
// }

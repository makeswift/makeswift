import { type CSSObject } from '@emotion/serialize'

import {
  type Breakpoints,
  ResolvedStyle,
  type ResolvedStyleV2,
  type ResolvedTypographyStyle,
  getBaseBreakpoint,
  getBreakpointMediaQuery,
} from '@makeswift/controls'

import { styleV1Css } from './controls/style'
import { typographyCss } from './controls/typography'

function isTypographyStyle(style: ResolvedStyle): style is ResolvedTypographyStyle {
  return Array.isArray(style)
}

function isStyleV2(style: ResolvedStyle): style is ResolvedStyleV2 {
  return typeof style === 'object' && 'getStyle' in style && typeof style.getStyle === 'function'
}

function styleV2Css(breakpoints: Breakpoints, style: ResolvedStyleV2<CSSObject>): CSSObject {
  return {
    ...style.getStyle(getBaseBreakpoint(breakpoints)),
    ...breakpoints.reduce(
      (styles, breakpoint) => ({
        ...styles,
        [getBreakpointMediaQuery(breakpoint)]: style.getStyle(breakpoint),
      }),
      {},
    ),
  }
}

export function resolvedStyleToCss(breakpoints: Breakpoints, style: ResolvedStyle): CSSObject {
  if (isTypographyStyle(style)) {
    return typographyCss(breakpoints, style)
  }

  if (isStyleV2(style)) {
    return styleV2Css(breakpoints, style as ResolvedStyleV2<CSSObject>)
  }

  const { properties, styleData } = style
  return styleV1Css(breakpoints, styleData, properties)
}

import { useMemo, useEffect, useRef } from 'react'
import { type CSSObject, serializeStyles } from '@emotion/serialize'
import { type EmotionCache } from '@emotion/cache'
import { type SerializedStyles } from '@emotion/utils'

import {
  type Breakpoints,
  type BoxModel,
  type Stylesheet,
  type ResolvedStyle,
  type ResolvedStyleV2,
  type ResolvedTypographyStyle,
  isNotNil,
  getBaseBreakpoint,
  getBreakpointMediaQuery,
} from '@makeswift/controls'

import { useCache } from '../../../next/root-style-registry'

import { styleV1Css } from '../controls/style'
import { typographyCss } from '../controls/typography'

import { useBreakpoints } from './use-breakpoints'
import { useCssId } from './use-css-id'
import { useStyles, serializedStyleClassName } from '../use-style'
import { pollBoxModel } from '../poll-box-model'

export type StylesheetFactory = {
  get(propName: string): Stylesheet
  useDefinedStyles(): void
}

export function useStylesheetFactory(): StylesheetFactory {
  const breakpoints = useBreakpoints()
  const cache = useCache()
  const componentUid = useCssId()

  const computedStyles = useRef<Record<string, SerializedStyles>>({}).current
  const boxModelCallbacks = useRef<Record<string, (boxModel: BoxModel | null) => void>>({}).current

  return useMemo(() => {
    const getStylesheet = (styleSheetId: string): Stylesheet => ({
      breakpoints(): Breakpoints {
        return breakpoints
      },

      defineStyle(
        style: ResolvedStyle,
        onBoxModelChange?: (boxModel: BoxModel | null) => void,
      ): string {
        const serialized = serializeStyle(breakpoints, style, cache)
        const uid = `u-${componentUid}-${styleSheetId}`
        computedStyles[uid] = serialized

        const className = serializedStyleClassName(cache, serialized)
        if (!onBoxModelChange) return className

        boxModelCallbacks[uid] = onBoxModelChange
        return `${className} ${uid}`
      },

      child(id: string): Stylesheet {
        return getStylesheet(`${styleSheetId}-${id}`)
      },
    })

    return {
      get(propName: string): Stylesheet {
        return getStylesheet(propName)
      },

      useDefinedStyles() {
        useStyles(cache, Object.values(computedStyles))

        useEffect(() => {
          const unsubscribes = Object.entries(boxModelCallbacks)
            .map(([uid, callback]) =>
              callback != null
                ? pollBoxModel({
                    element: document.querySelector(`.${uid}`),
                    onBoxModelChange: callback,
                  })
                : undefined,
            )
            .filter(isNotNil)

          return () => unsubscribes.forEach(fn => fn())
        }, [Object.keys(boxModelCallbacks).join(' ')])
      },
    }
  }, [breakpoints, cache, componentUid])
}

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

function resolvedStyleToCss(breakpoints: Breakpoints, style: ResolvedStyle) {
  if (isTypographyStyle(style)) {
    return typographyCss(breakpoints, style)
  }

  if (isStyleV2(style)) {
    return styleV2Css(breakpoints, style as ResolvedStyleV2<CSSObject>)
  }

  const { properties, styleData } = style
  return styleV1Css(breakpoints, styleData, properties)
}

function serializeStyle(
  breakpoints: Breakpoints,
  style: ResolvedStyle,
  cache: EmotionCache,
): SerializedStyles {
  const css = resolvedStyleToCss(breakpoints, style)
  return serializeStyles([css], cache.registered)
}

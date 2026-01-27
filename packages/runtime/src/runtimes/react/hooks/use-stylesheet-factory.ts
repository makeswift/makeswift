import { useMemo, useEffect, useRef } from 'react'
import { serializeStyles } from '@emotion/serialize'
import { type EmotionCache } from '@emotion/cache'
import { type SerializedStyles } from '@emotion/utils'

import {
  type Breakpoints,
  type BoxModel,
  type Stylesheet,
  type ResolvedStyle,
  isNotNil,
} from '@makeswift/controls'

import { useCache } from '../root-style-registry'

import { useBreakpoints } from './use-breakpoints'
import { useCssId } from './use-css-id'
import { useStyles, serializedStyleClassName } from '../use-style'
import { pollBoxModel } from '../poll-box-model'
import { resolvedStyleToCss } from '../resolve-style'

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

function serializeStyle(
  breakpoints: Breakpoints,
  style: ResolvedStyle,
  cache: EmotionCache,
): SerializedStyles {
  const css = resolvedStyleToCss(breakpoints, style)
  return serializeStyles([css], cache.registered)
}

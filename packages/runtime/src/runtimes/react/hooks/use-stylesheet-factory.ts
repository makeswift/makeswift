import { useMemo, useEffect, useRef } from 'react'
import { serializeStyles } from '@emotion/serialize'
import { type EmotionCache } from '@emotion/cache'
import { type SerializedStyles } from '@emotion/utils'

import {
  type StyleProperty,
  type BoxModel,
  type ResponsiveValue,
  type Stylesheet,
  type ResolvedStyleData,
  type ResolvedTypographyStyle,
  isNotNil,
} from '@makeswift/controls'

import { useCache } from '../../../next/root-style-registry'
import { type Breakpoints } from '../../../state/modules/breakpoints'

import { getStyleControlCssObject } from '../controls/style'
import { useBreakpoints } from './use-breakpoints'
import { useCssId } from './use-css-id'
import { useStyles } from '../use-style'
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
        props: StyleProperty[],
        style: ResolvedTypographyStyle | ResolvedStyleData,
        onBoxModelChange?: (boxModel: BoxModel | null) => void,
      ): string {
        const serialized = serializeStyle(breakpoints, style, props, cache)
        const uid = `u-${componentUid}-${styleSheetId}`
        computedStyles[uid] = serialized
        if (onBoxModelChange) boxModelCallbacks[uid] = onBoxModelChange
        return `${uid} ${fullSerializedClassName(cache, serialized)}`
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

function isResponsiveValue(value: any): value is ResponsiveValue<any> {
  return 'deviceId' in value
}

function styleToCssObject(
  breakpoints: Breakpoints,
  style: ResolvedStyleData | ResolvedTypographyStyle,
  props: StyleProperty[],
) {
  if (isResponsiveValue(style)) {
    // FIXME
    console.error('Style v2 is not supported yet')
    return {}
  }

  return getStyleControlCssObject(breakpoints, style, props)
}

function serializeStyle(
  breakpoints: Breakpoints,
  style: ResolvedStyleData | ResolvedTypographyStyle,
  props: StyleProperty[],
  cache: EmotionCache,
): SerializedStyles {
  const cssObject = styleToCssObject(breakpoints, style, props)
  const serialized = serializeStyles([cssObject], cache.registered)
  return serialized
}

function fullSerializedClassName(cache: EmotionCache, serialized: SerializedStyles): string {
  // see https://github.com/emotion-js/emotion/blob/main/packages/utils/src/index.ts#L26
  return `${cache.key}-${serialized.name}`
}

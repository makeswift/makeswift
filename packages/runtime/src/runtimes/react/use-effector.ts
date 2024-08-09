import { useMemo, useEffect, useRef, useId } from 'react'
import { serializeStyles } from '@emotion/serialize'
import { type EmotionCache } from '@emotion/cache'
import { type SerializedStyles } from '@emotion/utils'

import {
  type StyleProperty,
  type BoxModel,
  type ResponsiveValue,
  type Effector,
  type ResolvedStyleData,
  notNil,
} from '@makeswift/controls'

import { useCache } from '../../next/root-style-registry'
import { type Breakpoints } from '../../state/modules/breakpoints'

import { getStyleControlCssObject } from './controls/style'
import { useBreakpoints } from './hooks/use-breakpoints'
import { useStyles } from './use-style'
import { pollBoxModel } from './poll-box-model'

export type EffectorFactory = {
  get(propName: string): Effector
  useStyles(): void
}

export function useEffectorFactory(): EffectorFactory {
  const breakpoints = useBreakpoints()
  const cache = useCache()
  const componentUid = useId().replaceAll(':', '') // colons are prohibited in class names

  const computedStyles = useRef<Record<string, SerializedStyles>>({}).current
  const boxModelCallbacks = useRef<Record<string, (boxModel: BoxModel | null) => void>>({}).current

  return useMemo(() => {
    return {
      get(propName: string): Effector {
        const styleUid = () => `u-${componentUid}-${propName}`

        return {
          computeClassName(
            previous: string | undefined,
            props: StyleProperty[],
            style: ResponsiveValue<any> | ResolvedStyleData,
          ): string {
            const serialized = serializeStyle(breakpoints, style, props)
            const serializedClassName = fullSerializedClassName(cache, serialized)

            const uid = extractUid(previous) ?? styleUid()
            computedStyles[uid] = serialized
            return `${uid} ${serializedClassName}`
          },

          defineStyle: (
            className: string,
            _props: StyleProperty[],
            _style: ResolvedStyleData | ResponsiveValue<any>,
            onBoxModelChange?: (boxModel: BoxModel | null) => void,
          ) => {
            const [uid, _] = splitClassName(className)
            if (onBoxModelChange) boxModelCallbacks[uid] = onBoxModelChange

            // const serialized = serializeStyle(breakpoints, style, props, cache)
            // const styleClassName = `${cache.key}-${serialized.name}` // see https://github.com/emotion-js/emotion/blob/main/packages/utils/src/index.ts#L26
          },
        }
      },

      useStyles() {
        // const currentStyles = useSyncExternalStore(
        //   propsSubscription.subscribe,
        //   propsSubscription.readStableValue,
        //   propsSubscription.readStableValue,
        // )

        // console.log('+++ effector.useStyle')
        useStyles(
          cache,
          Object.entries(computedStyles).map(([_, style]) => style),
        )

        useEffect(() => {
          // console.log('+++ useStyle pollBoxModel effect')
          const unsubscribes = Object.entries(boxModelCallbacks)
            .map(([uid, callback]) =>
              callback != null
                ? pollBoxModel({
                    element: document.querySelector(`.${uid}`),
                    onBoxModelChange: callback,
                  })
                : undefined,
            )
            .filter(notNil)

          return () => unsubscribes.forEach(fn => fn())
        }, [...Object.values(computedStyles).map(style => style.name)])

        // console.log('--- effector.useStyle')
      },
    }
  }, [breakpoints, cache, componentUid])
}

function isResponsiveValue(value: any): value is ResponsiveValue<any> {
  return 'deviceId' in value
}

function splitClassName(className: string): [string, string] {
  const [uid, serializedClassName] = className.split(' ')
  console.assert(uid.startsWith('u-'), `expected style uid to start with "u-", got ${uid}`)
  console.assert(
    serializedClassName != null,
    `expected class name '${className}' to contain a serialized class name`,
  )

  return [uid, serializedClassName ?? '']
}

function extractUid(className: string | undefined): string | undefined {
  return className == null ? undefined : splitClassName(className)[0]
}

function styleToCssObject(
  breakpoints: Breakpoints,
  style: ResolvedStyleData | ResponsiveValue<any>,
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
  style: ResolvedStyleData | ResponsiveValue<any>,
  props: StyleProperty[],
  cache?: EmotionCache,
): SerializedStyles {
  const cssObject = styleToCssObject(breakpoints, style, props)
  const serialized = serializeStyles([cssObject], cache?.registered ?? {})
  return serialized
}

function fullSerializedClassName(cache: EmotionCache, serialized: SerializedStyles): string {
  // see https://github.com/emotion-js/emotion/blob/main/packages/utils/src/index.ts#L26
  return `${cache.key}-${serialized.name}`
}

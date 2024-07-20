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
  useEffects(): void
  useStyles(): void
}

export function useEffectorFactory(): EffectorFactory {
  const breakpoints = useBreakpoints()
  const cache = useCache()
  const componentUid = useId().replaceAll(':', '') // colons are prohibited in class names

  const effects = useRef<(() => void)[]>([]).current
  const asyncEffects = useRef<(() => Promise<unknown>)[]>([]).current

  const styles = useRef<
    Record<string, { style: SerializedStyles; callback?: (boxModel: BoxModel | null) => void }>
  >({}).current

  return useMemo(() => {
    return {
      get(propName: string): Effector {
        const styleUid = () => `u-${componentUid}-${propName}`

        return {
          queueEffect: (effect: () => void) => {
            effects.push(effect)
          },

          queueAsyncEffect: (effect: () => Promise<unknown>) => {
            asyncEffects.push(effect)
          },

          defineStyle: (
            className: string | undefined,
            props: StyleProperty[],
            style: ResolvedStyleData | ResponsiveValue<any>,
            onBoxModelChange?: (boxModel: BoxModel | null) => void,
          ): string => {
            const [serialized, styleClassName] = serializeStyle(cache, breakpoints, style, props)
            const uid = extractUid(className) ?? styleUid()
            styles[uid] = { style: serialized, callback: onBoxModelChange }
            return `${uid} ${styleClassName}`
          },
        }
      },

      useEffects() {
        useEffect(() => {
          while (effects.length > 0) {
            effects.shift()?.()
          }
        }, [effects])

        useEffect(() => {
          while (asyncEffects.length > 0) {
            asyncEffects.shift()?.().catch(console.error)
          }
        }, [asyncEffects])
      },

      useStyles() {
        // const currentStyles = useSyncExternalStore(
        //   propsSubscription.subscribe,
        //   propsSubscription.readStableValue,
        //   propsSubscription.readStableValue,
        // )

        console.log('+++ effector.useStyle')
        useStyles(
          cache,
          Object.entries(styles).map(([_, { style }]) => style),
        )

        useEffect(() => {
          console.log('+++ useStyle pollBoxModel effect')
          const unsubscribes = Object.entries(styles)
            .map(([uid, { callback }]) => [uid, callback] as const)
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
        }, [...Object.values(styles).map(({ style }) => style.name)])

        console.log('--- effector.useStyle')
      },
    }
  }, [breakpoints, cache, componentUid])
}

function isResponsiveValue(value: any): value is ResponsiveValue<any> {
  return 'deviceId' in value
}

function extractUid(name: string | undefined): string | undefined {
  if (name == null) return undefined

  const uid = name.split(' ')[0]
  console.assert(uid?.startsWith('u-'), `expected style uid to start with "u-", got ${uid}`)
  return uid
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
  cache: EmotionCache,
  breakpoints: Breakpoints,
  style: ResolvedStyleData | ResponsiveValue<any>,
  props: StyleProperty[],
): [SerializedStyles, string] {
  const cssObject = styleToCssObject(breakpoints, style, props)
  const serialized = serializeStyles([cssObject], cache.registered)
  return [
    serialized,
    `${cache.key}-${serialized.name}`, // see https://github.com/emotion-js/emotion/blob/main/packages/utils/src/index.ts#L26
  ]
}

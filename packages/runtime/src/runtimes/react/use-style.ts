import React, { useMemo, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { CSSObject } from '@emotion/css'
import { EmotionCache } from '@emotion/cache'
import { serializeStyles } from '@emotion/serialize'
import { registerStyles, insertStyles, type SerializedStyles } from '@emotion/utils'

import {
  type StyleProperty,
  type BoxModel,
  type ResponsiveValue,
  type Effector,
  type ResolvedStyleData,
  notNil,
} from '@makeswift/controls'

import { useCache } from '../../next/root-style-registry'

import { getStyleControlCssObject } from './controls/style'
import { useBreakpoints } from './hooks/use-breakpoints'
import { pollBoxModel } from './poll-box-model'

const isServer = typeof window === 'undefined'
const useInsertionEffectSpecifier = 'useInsertionEffect'
const useInsertionEffect = React[useInsertionEffectSpecifier] ?? React.useLayoutEffect

export function useStyle(style: CSSObject): string {
  const cache = useCache()
  const serialized = serializeStyles([style], cache.registered)

  registerStyles(cache, serialized, false)

  useInsertionEffect(() => {
    insertStyles(cache, serialized, false)
  })

  if (isServer) insertStyles(cache, serialized, false)

  return `${cache.key}-${serialized.name}`
}

function useUniversalInsertionEffect(effect: () => void) {
  useInsertionEffect(effect)
  if (isServer) effect()
}

function useStyles(cache: EmotionCache, styles: SerializedStyles[]) {
  styles.forEach(s => registerStyles(cache, s, false))
  useUniversalInsertionEffect(() => {
    styles.forEach(s => insertStyles(cache, s, false))
  })
}

function isResponsiveValue(value: any): value is ResponsiveValue<any> {
  return 'deviceId' in value
}

function styleUid(): string {
  return `u-${uuid()}`
}

function extractUid(name: string | undefined): string | undefined {
  if (name == null) return undefined

  const uid = name.split(' ')[0]
  console.assert(uid?.startsWith('u-'), `expected style uid to start with "u-", got ${uid}`)
  return uid
}

export function useEffector(): Effector & { useStyles(): void } {
  const breakpoints = useBreakpoints()
  const cache = useCache()

  const effector = useMemo(() => {
    const styles: Record<
      string,
      { style: SerializedStyles; callback?: (boxModel: BoxModel | null) => void }
    > = {}

    return {
      defineStyle: (
        name: string | undefined,
        props: StyleProperty[],
        style: ResolvedStyleData | ResponsiveValue<any>,
        onBoxModelChange?: (boxModel: BoxModel | null) => void,
      ): string => {
        if (isResponsiveValue(style)) {
          // FIXME
          console.error('Style v2 is not supported yet')
          return name ?? styleUid()
        }

        const cssObject = getStyleControlCssObject(breakpoints, style, props)
        const serialized = serializeStyles([cssObject], cache.registered)
        const styleClassName = `${cache.key}-${serialized.name}` // see https://github.com/emotion-js/emotion/blob/main/packages/utils/src/index.ts#L26

        const uid = extractUid(name) ?? styleUid()
        styles[uid] = { style: serialized, callback: onBoxModelChange }
        console.log('+++ defineStyle', uid, styleClassName)
        return `${uid} ${styleClassName}`
      },

      useStyles: () => {
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
  }, [breakpoints])

  return effector
}

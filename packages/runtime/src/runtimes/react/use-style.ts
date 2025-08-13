import React from 'react'
import { type CSSObject } from '@emotion/serialize'
import { EmotionCache } from '@emotion/cache'
import { serializeStyles } from '@emotion/serialize'
import { registerStyles, insertStyles, type SerializedStyles } from '@emotion/utils'

import { isServer } from '../../utils/is-server'

import { useCache } from './root-style-registry'

const useInsertionEffectSpecifier = 'useInsertionEffect'
const useInsertionEffect = React[useInsertionEffectSpecifier] ?? React.useLayoutEffect

export function useStyle(style: CSSObject): string {
  const cache = useCache()
  const serialized = serializeStyles([style], cache.registered)

  registerStyles(cache, serialized, false)

  useUniversalInsertionEffect(() => {
    insertStyles(cache, serialized, false)
  })

  return serializedStyleClassName(cache, serialized)
}

export function useStyles(cache: EmotionCache, styles: SerializedStyles[]) {
  styles.forEach(s => registerStyles(cache, s, false))

  useUniversalInsertionEffect(() => {
    styles.forEach(s => insertStyles(cache, s, false))
  })
}

function useUniversalInsertionEffect(effect: () => void) {
  useInsertionEffect(effect)
  if (isServer()) effect()
}

export function serializedStyleClassName(
  cache: EmotionCache,
  serialized: SerializedStyles,
): string {
  // see https://github.com/emotion-js/emotion/blob/main/packages/utils/src/index.ts#L26
  return `${cache.key}-${serialized.name}`
}

import * as React from 'react'
import { cache, CSSObject } from '@emotion/css'
import { serializeStyles } from '@emotion/serialize'
import { registerStyles, insertStyles } from '@emotion/utils'

const isServer = typeof window === 'undefined'
const useInsertionEffectSpecifier = 'useInsertionEffect'
// @ts-expect-error: React types are outdated.
const useInsertionEffect = React[useInsertionEffectSpecifier] ?? React.useLayoutEffect

export function useStyle(style: CSSObject): string {
  const serialized = serializeStyles([style], cache.registered)

  registerStyles(cache, serialized, false)

  useInsertionEffect(() => {
    insertStyles(cache, serialized, false)
  })

  if (isServer) insertStyles(cache, serialized, false)

  return `${cache.key}-${serialized.name}`
}

import React from 'react'
import { CSSObject } from '@emotion/css'
import { serializeStyles } from '@emotion/serialize'
import { registerStyles, insertStyles } from '@emotion/utils'
import { useCache } from '../../next/root-style-registry'

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

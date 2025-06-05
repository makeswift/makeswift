'use client'

import createCache, { EmotionCache } from '@emotion/cache'
import { cache } from '@emotion/css'
import { useServerInsertedHTML } from 'next/navigation'
import { ReactNode, createContext, useContext, useState } from 'react'

const CacheContext = createContext(cache)

const DEFAULT_CSS_RESET_ENABLED = true
const CSSResetEnabledContext = createContext(DEFAULT_CSS_RESET_ENABLED)

const createRootStyleCache = ({ key }: { key: string }) => {
  const cache = createCache({ key })
  cache.compat = true

  const prevInsert = cache.insert
  let inserted: string[] = []

  cache.insert = (...args) => {
    const serialized = args[1]
    if (cache.inserted[serialized.name] === undefined) {
      inserted.push(serialized.name)
    }
    return prevInsert(...args)
  }

  const flush = () => {
    const prevInserted = inserted
    inserted = []
    return prevInserted
  }

  return { cache, flush }
}

type Props = {
  children: ReactNode
  cacheKey?: string
  /**
   * Toggle the built-in CSS reset.
   * Set to `false` when using `@layer`-based CSS frameworks like Tailwind.
   */
  enableCssReset?: boolean
}

export function RootStyleRegistry({
  children,
  cacheKey,
  enableCssReset = DEFAULT_CSS_RESET_ENABLED,
}: Props) {
  const [{ cache, flush }] = useState(() => createRootStyleCache({ key: cacheKey ?? 'mswft' }))

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) return null
    let styles = ''
    for (const name of names) {
      styles += cache.inserted[name]
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    )
  })

  return (
    <CacheContext.Provider value={cache}>
      <CSSResetEnabledContext.Provider value={enableCssReset}>
        {children}
      </CSSResetEnabledContext.Provider>
    </CacheContext.Provider>
  )
}

export function useCache(): EmotionCache {
  return useContext(CacheContext)
}

export function useCSSResetEnabled(): boolean {
  return useContext(CSSResetEnabledContext)
}

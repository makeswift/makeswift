'use client'

import createCache, { EmotionCache } from '@emotion/cache'
import { cache } from '@emotion/css'
import { useServerInsertedHTML } from 'next/navigation'
import { ReactNode, createContext, useContext, useState } from 'react'

const CacheContext = createContext(cache)

const createRootStyleCache = (cacheKeyPrefix?: string) => {
  let key = 'makeswift-css'

  if (typeof cacheKeyPrefix === 'string') key = `${cacheKeyPrefix}-css`

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

export function RootStyleRegistry({ children, cacheKeyPrefix }: { children: ReactNode, cacheKeyPrefix?: string }) {
  const [{ cache, flush }] = useState(() => createRootStyleCache(cacheKeyPrefix))

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

  return <CacheContext.Provider value={cache}>{children}</CacheContext.Provider>
}

export function useCache(): EmotionCache {
  return useContext(CacheContext)
}

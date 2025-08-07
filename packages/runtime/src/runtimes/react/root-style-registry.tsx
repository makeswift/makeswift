import createCache, { EmotionCache } from '@emotion/cache'
import { cache } from '@emotion/css'
import { ReactNode, createContext, useContext } from 'react'

const CacheContext = createContext(cache)

const DEFAULT_CSS_RESET_ENABLED = true
const CSSResetEnabledContext = createContext(DEFAULT_CSS_RESET_ENABLED)

export const createRootStyleCache = ({ key }: { key?: string } = {}) => {
  const cache = createCache({ key: key ?? 'mswft' })
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
  cache: EmotionCache
  /**
   * Toggle the built-in CSS reset.
   * Set to `false` when using `@layer`-based CSS frameworks like Tailwind.
   */
  enableCssReset?: boolean
}

export function RootStyleRegistry({ children, cache, enableCssReset }: Props) {
  return (
    <CacheContext.Provider value={cache}>
      <CSSResetEnabledContext.Provider value={enableCssReset ?? DEFAULT_CSS_RESET_ENABLED}>
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

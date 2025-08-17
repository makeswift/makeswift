'use client'

import createCache, { type EmotionCache } from '@emotion/cache'
import { cache } from '@emotion/css'
import { ReactNode, createContext, useContext } from 'react'

const CacheContext = createContext(cache)

const DEFAULT_CSS_RESET_ENABLED = true
const CSSResetEnabledContext = createContext(DEFAULT_CSS_RESET_ENABLED)

export type StyleCache = EmotionCache & {
  /**
   * Flush the inserted styles.
   * @returns A list of class names and the corresponding CSS rules that were flushed.
   */
  flush: () => { classNames: string[]; css: string }
}

export const createRootStyleCache = ({ key }: { key?: string } = {}): StyleCache => {
  const cache = createCache({ key: key ?? 'mswft' })
  cache.compat = true

  // additional state to track inserted style names
  let inserted: string[] = []

  return {
    ...cache,

    // override the `insert` method to track inserted names
    insert(...args) {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return cache.insert(...args)
    },

    flush() {
      const classNames = inserted
      // reset our own state, leave `cache.inserted` intact
      inserted = []

      return {
        classNames,
        css: classNames.reduce((css, name) => {
          return css + cache.inserted[name]
        }, ''),
      }
    },
  }
}

type Props = {
  children: ReactNode
  cache: StyleCache
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

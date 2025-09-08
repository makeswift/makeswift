'use client'

import { type PropsWithChildren, createContext, useContext } from 'react'

import { type BaseStyleCache, type StyleTagProps, createStyleCache } from './lib/style-cache/base'

// default cache context with a sentinel key signaling misconfiguration
const CacheContext = createContext(createStyleCache({ key: 'msft-err' }))

const DEFAULT_CSS_RESET_ENABLED = true
const CSSResetEnabledContext = createContext(DEFAULT_CSS_RESET_ENABLED)

export const StyleTagSSR = ({ cacheKey, classNames, css }: StyleTagProps) => (
  <style
    data-emotion={`${cacheKey} ${classNames.join(' ')}`}
    dangerouslySetInnerHTML={{
      __html: css,
    }}
  />
)

export type RootStyleProps = {
  /**
   * The key used to prefix generated class names.
   * If not provided, a default key will be used.
   */
  cacheKey?: string
  /**
   * Toggle the built-in CSS reset.
   * Set to `false` when using `@layer`-based CSS frameworks like Tailwind.
   */
  enableCssReset?: boolean
}

export function RootStyleRegistry({
  children,
  cache,
  enableCssReset,
}: PropsWithChildren<{
  cache: BaseStyleCache
  enableCssReset?: boolean
}>) {
  return (
    <CacheContext.Provider value={cache}>
      <CSSResetEnabledContext.Provider value={enableCssReset ?? DEFAULT_CSS_RESET_ENABLED}>
        {children}
      </CSSResetEnabledContext.Provider>
    </CacheContext.Provider>
  )
}

export function useCache(): BaseStyleCache {
  return useContext(CacheContext)
}

export function useCSSResetEnabled(): boolean {
  return useContext(CSSResetEnabledContext)
}

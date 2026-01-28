import createCache, { type EmotionCache } from '@emotion/cache'

export type BaseStyleCache = EmotionCache

export const createStyleCache = ({ key }: { key?: string } = {}): BaseStyleCache => {
  const cache = createCache({ key: key ?? 'mswft' })
  cache.compat = true

  return cache
}

export type StyleTagProps = {
  cacheKey: string
  classNames: string[]
  css: string
}

export const styleTagHtml = ({ cacheKey, classNames, css }: StyleTagProps): string =>
  `<style data-emotion="${cacheKey} ${classNames.join(' ')}">${css}</style>`

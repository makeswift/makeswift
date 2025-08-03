'use client'

import { type ReactNode, useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import {
  createRootStyleCache,
  RootStyleRegistry as ReactRootStyleRegistry,
} from '../runtimes/react/root-style-registry'

export { useCache, useCSSResetEnabled } from '../runtimes/react/root-style-registry'

type Props = {
  children: ReactNode
  cacheKey?: string
  /**
   * Toggle the built-in CSS reset.
   * Set to `false` when using `@layer`-based CSS frameworks like Tailwind.
   */
  enableCssReset?: boolean
}

export function RootStyleRegistry({ children, cacheKey, enableCssReset }: Props) {
  const [{ cache, flush }] = useState(() => createRootStyleCache({ key: cacheKey }))

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
    <ReactRootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </ReactRootStyleRegistry>
  )
}

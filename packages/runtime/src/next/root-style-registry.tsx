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

export function NextRootStyleRegistry({ children, cacheKey, enableCssReset }: Props) {
  const [cache] = useState(() => createRootStyleCache({ key: cacheKey }))

  useServerInsertedHTML(() => {
    const { classNames, css } = cache.flush()

    return classNames.length > 0 ? (
      <style
        data-emotion={`${cache.key} ${classNames.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: css,
        }}
      />
    ) : null
  })

  return (
    <ReactRootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </ReactRootStyleRegistry>
  )
}

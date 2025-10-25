'use client'

import { type PropsWithChildren, useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import { createFlushableStyleCache } from '../runtimes/react/lib/style-cache'

import {
  RootStyleRegistry as ReactRootStyleRegistry,
  StyleTagSSR,
  type RootStyleProps,
} from '../runtimes/react/root-style-registry'

export function NextRootStyleRegistry({
  children,
  cacheKey,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  const [cache] = useState(() => createFlushableStyleCache({ key: cacheKey }))

  useServerInsertedHTML(() => {
    const { classNames, css } = cache.flush()

    return classNames.length > 0 ? (
      <StyleTagSSR cacheKey={cache.key} classNames={classNames} css={css} />
    ) : null
  })

  return (
    <ReactRootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </ReactRootStyleRegistry>
  )
}

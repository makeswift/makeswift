'use client'

import { type PropsWithChildren, useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import {
  createRootStyleCache,
  RootStyleRegistry as ReactRootStyleRegistry,
  StyleTagSSR,
  type RootStyleProps,
} from '../runtimes/react/root-style-registry'

export function NextRootStyleRegistry({
  children,
  cacheKey,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  const [cache] = useState(() => createRootStyleCache({ key: cacheKey }))

  useServerInsertedHTML(() => {
    const { classNames, css } = cache.flush()

    return classNames.length > 0 ? (
      <StyleTagSSR key={cache.key} classNames={classNames} css={css} />
    ) : null
  })

  return (
    <ReactRootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </ReactRootStyleRegistry>
  )
}

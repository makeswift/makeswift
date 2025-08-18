'use client'

import { type PropsWithChildren, useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import {
  createRootStyleCache,
  RootStyleRegistry as ReactRootStyleRegistry,
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

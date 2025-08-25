import { type PropsWithChildren, useState } from 'react'

import {
  createRootStyleCache,
  RootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/framework-support'

export function ReactRootStyleRegistry({
  children,
  cacheKey,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  const [cache] = useState(createRootStyleCache({ key: cacheKey }))

  return (
    <RootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </RootStyleRegistry>
  )
}

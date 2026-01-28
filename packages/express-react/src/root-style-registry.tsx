import { type PropsWithChildren, useState } from 'react'

import {
  createStyleCache,
  RootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/unstable-framework-support'

export function ReactRootStyleRegistry({
  children,
  cacheKey,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  const [cache] = useState(createStyleCache({ key: cacheKey }))

  return (
    <RootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </RootStyleRegistry>
  )
}

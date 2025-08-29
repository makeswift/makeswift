import { type PropsWithChildren, useState } from 'react'

import {
  createRootStyleCache,
  RootStyleRegistry as ReactRootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/unstable-framework-support'

export function RemixRootStyleRegistry({
  children,
  cacheKey,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  const [cache] = useState(createRootStyleCache({ key: cacheKey }))

  return (
    <ReactRootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </ReactRootStyleRegistry>
  )
}

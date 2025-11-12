import { type PropsWithChildren, useState } from 'react'

import {
  createStyleCache,
  RootStyleRegistry as ReactRootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/unstable-framework-support'

export function RemixRootStyleRegistry({
  children,
  cacheKey,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  const [cache] = useState(createStyleCache({ key: cacheKey }))

  return (
    <ReactRootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </ReactRootStyleRegistry>
  )
}

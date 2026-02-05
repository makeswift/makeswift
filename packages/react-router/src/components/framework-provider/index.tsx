import { type PropsWithChildren, useState } from 'react'

import {
  FrameworkContext,
  DefaultHead,
  DefaultHeadSnippet,
  DefaultImage,
} from '@makeswift/runtime/unstable-framework-support'

import { Link } from './link'

export function FrameworkProvider({ children }: PropsWithChildren) {
  const [context] = useState<FrameworkContext>({
    Head: DefaultHead,
    HeadSnippet: DefaultHeadSnippet,
    Image: DefaultImage,
    Link,
    fetch: globalThis.fetch,
  })

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}

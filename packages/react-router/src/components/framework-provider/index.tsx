import { type PropsWithChildren, useState } from 'react'

import {
  FrameworkContext,
  DefaultHead,
  DefaultHeadSnippet,
  DefaultImage,
  versionedFetch,
  DefaultElementData,
} from '@makeswift/runtime/unstable-framework-support'

import { Link } from './link'

export function FrameworkProvider({ children }: PropsWithChildren) {
  const [context] = useState<FrameworkContext>({
    Head: DefaultHead,
    HeadSnippet: DefaultHeadSnippet,
    Image: DefaultImage,
    Link,
    versionedFetch,
    ElementData: DefaultElementData,
  })

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}

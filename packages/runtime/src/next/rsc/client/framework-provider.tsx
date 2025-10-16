'use client'

import { type PropsWithChildren, useMemo } from 'react'

import {
  DefaultHead,
  DefaultHeadSnippet,
  DefaultImage,
  DefaultLink,
  FrameworkContext,
  versionedFetch,
} from '../../../runtimes/react/components/framework-context'

// import { createRSCRefreshMiddleware } from './refresh-middleware'
import { RSCElementData } from './element-data'

export function NextRSCFrameworkProvider({ children }: PropsWithChildren) {
  // const router = useRouter()

  const context = useMemo<FrameworkContext>(
    () => ({
      Head: DefaultHead,
      HeadSnippet: DefaultHeadSnippet,
      Image: DefaultImage,
      Link: DefaultLink,
      versionedFetch,
      ElementData: RSCElementData,
      previewStoreMiddlewares: [],
    }),
    [],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}

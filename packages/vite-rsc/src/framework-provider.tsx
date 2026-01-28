'use client'

import { type PropsWithChildren, useMemo } from 'react'

import {
  FrameworkContext,
  DefaultHead,
  DefaultHeadSnippet,
  DefaultImage,
  versionedFetch,
  DefaultLink,
  RSCElementData,
} from '@makeswift/runtime/unstable-framework-support'

import { createViteRSCRefreshMiddleware, refreshRSC } from './refresh-middleware'

export function ViteRSCFrameworkProvider({ children }: PropsWithChildren) {
  const context = useMemo<FrameworkContext>(
    () => ({
      Head: DefaultHead,
      HeadSnippet: DefaultHeadSnippet,
      Image: DefaultImage,
      Link: DefaultLink,
      versionedFetch,
      ElementData: RSCElementData,
      previewStoreMiddlewares: [createViteRSCRefreshMiddleware()],
      refreshRSC,
    }),
    [],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}

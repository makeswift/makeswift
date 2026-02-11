'use client'

import { type PropsWithChildren, type ReactNode, useCallback, useMemo } from 'react'
import { createFromFetch } from '@vitejs/plugin-rsc/browser'

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
  const refreshRSCElement = useCallback(
    async (
      elementData: any,
      documentContext: { key: string; locale: string | null },
    ): Promise<ReactNode> => {
      const response = fetch('/__rsc-element', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ elementData, documentContext }),
      })
      return createFromFetch<ReactNode>(response)
    },
    [],
  )

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
      refreshRSCElement,
    }),
    [refreshRSCElement],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}

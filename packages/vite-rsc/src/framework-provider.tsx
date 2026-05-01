'use client'

import { type PropsWithChildren, type ReactNode, useCallback, useMemo } from 'react'

import {
  FrameworkContext,
  DefaultHead,
  DefaultHeadSnippet,
  DefaultImage,
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
      // Dynamic import: `@vitejs/plugin-rsc/browser` has client-only side effects on load
      // and must not run during the SSR pass of this `'use client'` module.
      const { createFromFetch } = await import('@vitejs/plugin-rsc/browser')
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
      ElementData: RSCElementData,
      previewStoreMiddlewares: [createViteRSCRefreshMiddleware()],
      refreshRSC,
      refreshRSCElement,
    }),
    [refreshRSCElement],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}

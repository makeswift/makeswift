'use client'

import { type PropsWithChildren, type ReactNode } from 'react'

import {
  FrameworkContextProvider,
  type RenderElementPayload,
  ServerElementsProvider,
} from '@makeswift/runtime/unstable-framework-support'

const renderRSCElement = async ({
  elementData,
  cacheData,
  documentContext,
}: RenderElementPayload): Promise<ReactNode> => {
  const response = fetch('/__rsc-element', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ elementData, cacheData, documentContext }),
  })

  // Dynamically import `@vitejs/plugin-rsc/browser` as has client-only side effects
  // which cannot be run during the SSR pass
  const { createFromFetch } = await import('@vitejs/plugin-rsc/browser')
  return createFromFetch<ReactNode>(response)
}

const context = {
  renderRSCElement,
}

const emptyServerElements = new Map<string, ReactNode>()

export function ViteRSCFrameworkProvider({
  children,
  serverElements = emptyServerElements,
}: PropsWithChildren<{ serverElements?: Map<string, ReactNode> }>) {
  return (
    <FrameworkContextProvider value={context}>
      <ServerElementsProvider elements={serverElements}>{children}</ServerElementsProvider>
    </FrameworkContextProvider>
  )
}

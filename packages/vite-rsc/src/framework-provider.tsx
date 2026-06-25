'use client'

import { type PropsWithChildren, type ReactNode } from 'react'

import { FrameworkContextProvider } from '@makeswift/runtime/unstable-framework-support'

const renderRSCElement = async (
  elementData: any,
  documentContext: { key: string; locale: string | null },
): Promise<ReactNode> => {
  const response = fetch('/__rsc-element', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ elementData, documentContext }),
  })

  // Dynamically import `@vitejs/plugin-rsc/browser` as has client-only side effects
  // which cannot be run during the SSR pass
  const { createFromFetch } = await import('@vitejs/plugin-rsc/browser')
  return createFromFetch<ReactNode>(response)
}

const context = {
  renderRSCElement,
}

export function ViteRSCFrameworkProvider({ children }: PropsWithChildren) {
  return <FrameworkContextProvider value={context}>{children}</FrameworkContextProvider>
}

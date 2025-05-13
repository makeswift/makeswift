// Makeswift provider for Remix

import * as React from 'react'
// For now, we'll use the Next.js ReactRuntimeProvider
// As we decouple, we'll create our own implementation
import { ReactRuntimeProvider } from '@makeswift/runtime/next'
import type { MakeswiftProviderProps } from './types'

/**
 * Makeswift provider component for Remix
 * 
 * Currently, this uses the Next.js ReactRuntimeProvider.
 * As we decouple, we'll replace it with our own implementation.
 */
export function MakeswiftProvider({
  children,
  locale = undefined,
  previewMode = false,
  apiOrigin,
  appOrigin,
  runtime,
}: MakeswiftProviderProps) {
  // Eventually, this will be replaced with a Remix-specific implementation
  // that doesn't depend on Next.js
  return (
    <ReactRuntimeProvider
      runtime={runtime}
      previewMode={previewMode}
      locale={locale}
      apiOrigin={apiOrigin}
      appOrigin={appOrigin}
    >
      {children}
    </ReactRuntimeProvider>
  )
}
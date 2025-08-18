'use client'

import { ReactRuntimeProvider } from '@makeswift/runtime/next'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'

export function MakeswiftProvider({
  children,
  previewMode,
}: {
  children: React.ReactNode
  previewMode: boolean
}) {
  return (
    <ReactRuntimeProvider runtime={runtime} previewMode={previewMode}>
      {children}
    </ReactRuntimeProvider>
  )
}

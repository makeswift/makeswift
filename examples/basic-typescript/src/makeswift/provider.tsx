'use client'

import { ReactRuntimeProvider, RootStyleRegistry } from '@makeswift/runtime/next'

import '@/makeswift/components'
import { runtime } from '@/makeswift/runtime'

export function MakeswiftProvider({
  children,
  previewMode,
}: {
  children: React.ReactNode
  previewMode: boolean
}) {
  return (
    <ReactRuntimeProvider previewMode={previewMode} runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

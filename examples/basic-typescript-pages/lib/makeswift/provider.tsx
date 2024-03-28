'use client'

import { ReactRuntimeProvider, RootStyleRegistry } from '@makeswift/runtime/next'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'

export function MakeswiftProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactRuntimeProvider runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

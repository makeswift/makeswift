'use client'

import { ReactNode } from 'react'

import { ReactRuntimeProvider, RootStyleRegistry } from '@makeswift/runtime/next'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'

export function MakeswiftProvider({
  children,
  locale = undefined,
  previewMode = false,
}: {
  children: ReactNode
  locale?: string
  previewMode: boolean
}) {
  return (
    <ReactRuntimeProvider {...{ runtime, previewMode, locale }}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

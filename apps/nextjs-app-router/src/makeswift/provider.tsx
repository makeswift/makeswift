'use client'

import { ReactNode } from 'react'

import { runtime } from '@/makeswift/runtime'
import {
  ReactRuntimeProvider,
  RootStyleRegistry,
} from '@makeswift/runtime/next'

import '@/makeswift/components'

export function MakeswiftProvider({
  children,
  locale = undefined,
  previewMode,
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

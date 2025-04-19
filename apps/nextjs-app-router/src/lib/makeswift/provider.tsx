'use client'

import { ReactNode } from 'react'

import { config } from '@/lib/makeswift/config'
import {
  ReactRuntimeProvider,
  RootStyleRegistry,
} from '@makeswift/runtime/next'

import '@/lib/makeswift/components'

export function MakeswiftProvider({
  children,
  locale = undefined,
  previewMode,
}: {
  children: ReactNode
  locale?: string
  previewMode: boolean
}) {
  const { runtime, apiOrigin, appOrigin } = config
  return (
    <ReactRuntimeProvider
      {...{ runtime, apiOrigin, appOrigin, previewMode, locale }}
    >
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

'use client'

import { ReactNode } from 'react'

import { runtime } from '@/makeswift/runtime'
import {
  ReactRuntimeProvider,
  RootStyleRegistry,
  type SiteVersion,
} from '@makeswift/runtime/next'

import '@/makeswift/components'

export function MakeswiftProvider({
  children,
  locale = undefined,
  siteVersion,
}: {
  children: ReactNode
  locale?: string
  siteVersion: SiteVersion | null
}) {
  return (
    <ReactRuntimeProvider {...{ runtime, siteVersion, locale }}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

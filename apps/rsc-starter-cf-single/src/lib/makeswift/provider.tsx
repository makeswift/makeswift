'use client'

import { type ReactNode } from 'react'

import {
  ReactRuntimeProvider,
  RootStyleRegistry,
  type SiteVersion,
} from '@makeswift/hono-react'

import { createRuntime } from './runtime'

const runtime = createRuntime()

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

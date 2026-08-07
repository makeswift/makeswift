'use client'

import { type ReactNode } from 'react'

import {
  ReactRuntimeProvider,
  RootStyleRegistry,
  type SiteVersion,
} from '@makeswift/hono-react'

import { ViteRSCFrameworkProvider } from '@makeswift/vite-rsc'

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
    <ViteRSCFrameworkProvider>
      <ReactRuntimeProvider {...{ runtime, siteVersion, locale }}>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </ReactRuntimeProvider>
    </ViteRSCFrameworkProvider>
  )
}

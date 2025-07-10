'use client'

import { ReactNode } from 'react'

import { runtime } from '@/makeswift/runtime'
import {
  MakeswiftVersionData,
  ReactRuntimeProvider,
  RootStyleRegistry,
} from '@makeswift/runtime/next'

import '@/makeswift/components'

export function MakeswiftProvider({
  children,
  locale = undefined,
  siteVersion,
}: {
  children: ReactNode
  locale?: string
  siteVersion: MakeswiftVersionData | null
}) {
  return (
    <ReactRuntimeProvider
      {...{ runtime, siteVersion, locale }}
      apiOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN}
    >
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

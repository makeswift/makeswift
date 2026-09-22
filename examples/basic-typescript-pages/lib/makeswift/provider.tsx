'use client'

import { ReactRuntimeProvider, SiteVersion } from '@makeswift/runtime/next'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'

export function MakeswiftProvider({
  children,
  siteVersion,
}: {
  children: React.ReactNode
  siteVersion: SiteVersion | null
}) {
  return (
    <ReactRuntimeProvider runtime={runtime} siteVersion={siteVersion}>
      {children}
    </ReactRuntimeProvider>
  )
}

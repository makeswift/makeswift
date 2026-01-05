'use client'

import { ReactRuntimeProvider, RootStyleRegistry, SiteVersion } from '@makeswift/runtime/next'

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
    <ReactRuntimeProvider siteVersion={siteVersion} runtime={runtime}>
      <RootStyleRegistry enableCssReset={false}>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

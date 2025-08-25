import { type ReactNode } from 'react'

import { ReactRuntimeProvider, type SiteVersion } from '@makeswift/react-router'

import { runtime } from './runtime'

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
    <ReactRuntimeProvider
      {...{ runtime, siteVersion, locale }}
      apiOrigin={import.meta.env.VITE_MAKESWIFT_API_ORIGIN}
      appOrigin={import.meta.env.VITE_MAKESWIFT_APP_ORIGIN}
    >
      {children}
    </ReactRuntimeProvider>
  )
}

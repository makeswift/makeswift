import { runtime } from './runtime'
import { ReactRuntimeProvider } from '@makeswift/runtime/remix'

import type { ReactNode } from 'react'

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
    <ReactRuntimeProvider
      {...{ runtime, previewMode, locale }}
      apiOrigin={import.meta.env.VITE_MAKESWIFT_API_ORIGIN}
      appOrigin={import.meta.env.VITE_MAKESWIFT_APP_ORIGIN}
    >
      {children}
    </ReactRuntimeProvider>
  )
}

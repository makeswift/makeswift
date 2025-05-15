import { runtime } from './runtime'
import {
  ReactRuntimeProvider,
  RootStyleRegistry,
} from '@makeswift/runtime/next'

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
      apiOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN}
    >
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

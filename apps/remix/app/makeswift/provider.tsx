import { runtime } from './runtime'
import { MAKESWIFT_API_ORIGIN, MAKESWIFT_APP_ORIGIN } from './env'

// Import components registration
import './components'
import type { ReactNode } from 'react'
import { ReactRuntimeProvider } from '@makeswift/runtime/next'

export function MakeswiftProvider({
  children,
  locale = undefined,
  previewMode = false,
}: {
  children: ReactNode
  locale?: string
  previewMode?: boolean
}) {
  return (
    <ReactRuntimeProvider
      runtime={runtime}
      locale={locale}
      previewMode={previewMode}
      apiOrigin={MAKESWIFT_API_ORIGIN}
      appOrigin={MAKESWIFT_APP_ORIGIN}
    >
      {children}
    </ReactRuntimeProvider>
  )
}

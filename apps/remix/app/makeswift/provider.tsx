import { runtime } from './runtime'
import { ReactRuntimeProvider } from '@makeswift/runtime/next'

// Import components registration
import './components'
import type { ReactNode } from 'react'

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
      previewMode={previewMode}
      locale={locale}
      apiOrigin={process.env.MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.MAKESWIFT_APP_ORIGIN}
    >
      {children}
    </ReactRuntimeProvider>
  )
}

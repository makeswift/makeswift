import { runtime } from './runtime'

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
      apiOrigin={process.env.MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.MAKESWIFT_APP_ORIGIN}
    >
      {children}
    </ReactRuntimeProvider>
  )
}

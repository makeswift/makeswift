import { runtime } from './runtime'
import { MakeswiftProvider as RemixMakeswiftProvider } from '@makeswift/remix'

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
    <RemixMakeswiftProvider
      runtime={runtime}
      locale={locale}
      previewMode={previewMode}
      apiOrigin={process.env.MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.MAKESWIFT_APP_ORIGIN}
    >
      {children}
    </RemixMakeswiftProvider>
  )
}

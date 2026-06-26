import { type PropsWithChildren } from 'react'

import { FrameworkContextProvider } from '@makeswift/runtime/unstable-framework-support'

import { Link } from './link'

const context = { Link }

export function FrameworkProvider({ children }: PropsWithChildren) {
  return <FrameworkContextProvider value={context}>{children}</FrameworkContextProvider>
}

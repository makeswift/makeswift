'use client'

import type { ComponentPropsWithoutRef } from 'react'

import {
  ViteRSCRuntimeProvider,
  ReactRootStyleRegistry,
} from '@makeswift/vite-rsc'

import './components.client'
import { runtime } from './runtime'

export function MakeswiftClientProvider({
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof ViteRSCRuntimeProvider>, 'runtime'>) {
  return (
    <ViteRSCRuntimeProvider
      {...props}
      runtime={runtime}
      apiOrigin={import.meta.env.VITE_MAKESWIFT_API_ORIGIN}
      appOrigin={import.meta.env.VITE_MAKESWIFT_APP_ORIGIN}
    >
      <ReactRootStyleRegistry>{children}</ReactRootStyleRegistry>
    </ViteRSCRuntimeProvider>
  )
}

'use client'

import { ComponentPropsWithoutRef } from 'react'

import { runtime } from '@/makeswift/runtime'

import { ExperimentalReactRuntimeProvider } from '@makeswift/runtime/next/rsc'
import { RootStyleRegistry } from '@makeswift/runtime/next'

import '@/makeswift/components.client'

export function MakeswiftClientProvider({
  children,
  ...props
}: Omit<
  ComponentPropsWithoutRef<typeof ExperimentalReactRuntimeProvider>,
  'runtime'
>) {
  return (
    <ExperimentalReactRuntimeProvider
      {...props}
      runtime={runtime}
      apiOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN}
    >
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ExperimentalReactRuntimeProvider>
  )
}

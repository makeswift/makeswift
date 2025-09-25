'use client'

import { ComponentPropsWithoutRef } from 'react'

import { runtime } from '@/makeswift/runtime'

import {
  ReactRuntimeProvider,
  RootStyleRegistry,
} from '@makeswift/runtime/next'

import '@/makeswift/components.client'

export function MakeswiftProvider({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof ReactRuntimeProvider>) {
  return (
    <ReactRuntimeProvider
      {...props}
      runtime={runtime}
      apiOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN}
    >
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

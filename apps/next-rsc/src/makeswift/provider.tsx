'use client'

import { ComponentPropsWithoutRef } from 'react'

import { runtime } from '@/makeswift/runtime'

import { NextRSCRuntimeProvider } from '@makeswift/runtime/next/rsc'
import { RootStyleRegistry } from '@makeswift/runtime/next'

import '@/makeswift/components.client'

export function MakeswiftClientProvider({
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof NextRSCRuntimeProvider>, 'runtime'>) {
  return (
    <NextRSCRuntimeProvider
      {...props}
      runtime={runtime}
      apiOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN}
      appOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN}
    >
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </NextRSCRuntimeProvider>
  )
}

'use client'

import { ComponentPropsWithoutRef } from 'react'

import { runtime } from './runtime'

import { ExperimentalReactRuntimeProvider } from '@makeswift/runtime/next/rsc'
// import { RootStyleRegistry } from '@makeswift/express-react'

import './components.client'

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
      apiOrigin={import.meta.env.VITE_MAKESWIFT_API_ORIGIN}
      appOrigin={import.meta.env.VITE_MAKESWIFT_APP_ORIGIN}
    >
      {/* <RootStyleRegistry> */}
      {children}
      {/* </RootStyleRegistry> */}
    </ExperimentalReactRuntimeProvider>
  )
}

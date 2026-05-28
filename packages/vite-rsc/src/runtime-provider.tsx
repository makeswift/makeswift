'use client'

import { ComponentProps } from 'react'

import {
  RuntimeProvider,
  SerializedServerState,
  RSCRuntime,
} from '@makeswift/runtime/unstable-framework-support'
import { ViteRSCFrameworkProvider } from './framework-provider'

export function ViteRSCRuntimeProvider({
  runtime,
  serializedServerState,
  ...props
}: Omit<ComponentProps<typeof RuntimeProvider>, 'runtime'> & {
  runtime: RSCRuntime
  serializedServerState: SerializedServerState
}) {
  runtime.loadServerState(serializedServerState)

  return (
    <ViteRSCFrameworkProvider>
      <RuntimeProvider runtime={runtime} {...props} />
    </ViteRSCFrameworkProvider>
  )
}

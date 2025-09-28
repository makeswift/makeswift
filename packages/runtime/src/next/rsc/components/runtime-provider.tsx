'use client'

import { ComponentProps } from 'react'

import { NextRSCRuntime, SerializedServerState } from './react-runtime'
import { RuntimeProvider } from '../../../runtimes/react/components/RuntimeProvider'
import { NextRSCFrameworkProvider } from './framework-provider'

export function NextRSCRuntimeProvider({
  runtime,
  serializedServerState,
  ...props
}: Omit<ComponentProps<typeof RuntimeProvider>, 'runtime'> & {
  runtime: NextRSCRuntime
  serializedServerState: SerializedServerState
}) {
  runtime.loadServerState(serializedServerState)

  return (
    <NextRSCFrameworkProvider>
      <RuntimeProvider runtime={runtime} {...props} />
    </NextRSCFrameworkProvider>
  )
}

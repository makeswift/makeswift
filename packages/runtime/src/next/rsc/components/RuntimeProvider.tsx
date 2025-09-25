'use client'

import { ComponentPropsWithoutRef, useMemo } from 'react'
import { ReactRuntime } from '../../../runtimes/react/react-runtime'
import { ReactRuntimeProvider, RootStyleRegistry } from '../..'
import { deserializeServerState, SerializedServerState } from '../serialization/serialization'

type Props = Omit<ComponentPropsWithoutRef<typeof ReactRuntimeProvider>, 'runtime'> & {
  serializedServerState: SerializedServerState
}

export function RuntimeProvider({ children, ...props }: Props) {
  const runtime = useMemo(
    () =>
      new ReactRuntime({
        preloadedState: deserializeServerState(props.serializedServerState),
      }),
    [props.serializedServerState],
  )

  return (
    <ReactRuntimeProvider {...props} runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

import { ComponentProps } from 'react'

import { RuntimeProvider } from '../runtimes/react/components/RuntimeProvider'

import { FrameworkProvider } from './components/framework-provider'

export function NextRuntimeProvider({
  children,
  ...props
}: ComponentProps<typeof RuntimeProvider>) {
  return (
    <FrameworkProvider>
      <RuntimeProvider {...props}>{children}</RuntimeProvider>
    </FrameworkProvider>
  )
}

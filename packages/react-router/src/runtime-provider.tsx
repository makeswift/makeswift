import { ComponentProps } from 'react'

import { RuntimeProvider } from '@makeswift/runtime/framework-support'

import { FrameworkProvider } from './components/framework-provider'

export function RemixRuntimeProvider({
  children,
  ...props
}: ComponentProps<typeof RuntimeProvider>) {
  return (
    <FrameworkProvider>
      <RuntimeProvider {...props}>{children}</RuntimeProvider>
    </FrameworkProvider>
  )
}

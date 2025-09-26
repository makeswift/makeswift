import { ComponentProps } from 'react'

import { RuntimeProvider } from '../../../runtimes/react/components/RuntimeProvider'

import { NextRSCFrameworkProvider } from './framework-provider'

export function NextRSCRuntimeProvider({
  children,
  ...props
}: ComponentProps<typeof RuntimeProvider>) {
  return (
    <NextRSCFrameworkProvider>
      <RuntimeProvider {...props}>{children}</RuntimeProvider>
    </NextRSCFrameworkProvider>
  )
}

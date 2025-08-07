import { ReactRuntime } from '../../runtimes/react/react-runtime'
import { RuntimeProvider } from '../../runtimes/react/components/RuntimeProvider'

import { FrameworkProvider } from '../components/framework-provider'
import { NextRootStyleRegistry } from '../root-style-registry'

export function ReactProvider({
  children,
  runtime,
  previewMode = false,
  forcePagesRouter = false,
}: {
  children: React.ReactNode
  runtime: ReactRuntime
  previewMode?: boolean
  forcePagesRouter?: boolean
}) {
  return (
    <FrameworkProvider forcePagesRouter={forcePagesRouter}>
      <RuntimeProvider previewMode={previewMode} runtime={runtime}>
        <NextRootStyleRegistry>{children}</NextRootStyleRegistry>
      </RuntimeProvider>
    </FrameworkProvider>
  )
}

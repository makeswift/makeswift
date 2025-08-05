import { ReactRuntime } from '../../runtimes/react/react-runtime'

import { RootStyleRegistry } from '../root-style-registry'
import { ReactRuntimeProvider } from '../../runtimes/react'

export function ReactProvider({
  children,
  runtime,
  previewMode = false,
}: {
  children: React.ReactNode
  runtime: ReactRuntime
  previewMode?: boolean
}) {
  return (
    <ReactRuntimeProvider previewMode={previewMode} runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

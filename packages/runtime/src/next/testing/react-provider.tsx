import { ReactRuntime } from '../../runtimes/react/react-runtime'

import { RootStyleRegistry } from '../root-style-registry'
import { NextRuntimeProvider } from '../runtime-provider'

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
    <NextRuntimeProvider previewMode={previewMode} runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </NextRuntimeProvider>
  )
}

import { cache } from '@emotion/css'
import { RootStyleRegistry } from '../root-style-registry'
import { ReactRuntimeProvider } from '../components/RuntimeProvider'
import { ReactRuntime } from '../react-runtime'

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
      <RootStyleRegistry cache={cache}>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

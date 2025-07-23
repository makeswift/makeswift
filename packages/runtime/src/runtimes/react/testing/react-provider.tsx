import { MakeswiftVersionData, RootStyleRegistry } from '../../../next'
import { ReactRuntimeProvider } from '../components/RuntimeProvider'
import { ReactRuntime } from '../react-runtime'

export function ReactProvider({
  children,
  runtime,
  siteVersion = null,
}: {
  children: React.ReactNode
  runtime: ReactRuntime
  siteVersion?: MakeswiftVersionData | null
}) {
  return (
    <ReactRuntimeProvider siteVersion={siteVersion} runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

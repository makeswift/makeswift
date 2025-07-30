import { SiteVersion } from '../../../api/site-version'
import { RootStyleRegistry } from '../../../next'
import { ReactRuntimeProvider } from '../components/RuntimeProvider'
import { ReactRuntime } from '../react-runtime'

export function ReactProvider({
  children,
  runtime,
  siteVersion = null,
}: {
  children: React.ReactNode
  runtime: ReactRuntime
  siteVersion?: SiteVersion | null
}) {
  return (
    <ReactRuntimeProvider siteVersion={siteVersion} runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  )
}

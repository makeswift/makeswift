import { type ReactRuntimeCore } from '../react-runtime-core'
import { RuntimeProvider } from '../components/RuntimeProvider'

import { DefaultRootStyleRegistry } from '../root-style-registry'
import { SiteVersion } from '../../../api/site-version'

export function ReactProvider({
  children,
  runtime,
  siteVersion = null,
}: {
  children: React.ReactNode
  runtime: ReactRuntimeCore
  siteVersion?: SiteVersion | null
}) {
  return (
    <RuntimeProvider siteVersion={siteVersion} runtime={runtime}>
      <DefaultRootStyleRegistry>{children}</DefaultRootStyleRegistry>
    </RuntimeProvider>
  )
}

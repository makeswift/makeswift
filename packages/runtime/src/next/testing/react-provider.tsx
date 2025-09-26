import { type ReactRuntimeCore } from '../../runtimes/react/react-runtime-core'
import { RuntimeProvider } from '../../runtimes/react/components/RuntimeProvider'

import { FrameworkProvider } from '../components/framework-provider'
import { NextRootStyleRegistry } from '../root-style-registry'
import { SiteVersion } from '../../api/site-version'

export function ReactProvider({
  children,
  runtime,
  siteVersion = null,
  forcePagesRouter = false,
}: {
  children: React.ReactNode
  runtime: ReactRuntimeCore
  siteVersion?: SiteVersion | null
  forcePagesRouter?: boolean
}) {
  return (
    <FrameworkProvider forcePagesRouter={forcePagesRouter}>
      <RuntimeProvider siteVersion={siteVersion} runtime={runtime}>
        <NextRootStyleRegistry>{children}</NextRootStyleRegistry>
      </RuntimeProvider>
    </FrameworkProvider>
  )
}

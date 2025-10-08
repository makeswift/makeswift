import { SiteVersion } from '../../../unstable-framework-support'
import { NextRSCRuntime } from '../shared/react-runtime'
import { setRuntime, setSiteVersion } from './runtime'

type Props = {
  runtime: NextRSCRuntime
  siteVersion: SiteVersion | null
  children: React.ReactNode
}

export function NextRSCServerProvider({ runtime, siteVersion, children }: Props) {
  setRuntime(runtime)
  setSiteVersion(siteVersion)

  return children
}

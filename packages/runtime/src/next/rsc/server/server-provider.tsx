import { MakeswiftClient, SiteVersion } from '../../../unstable-framework-support'
import { NextRSCRuntime } from '../shared/react-runtime'
import { setMakeswiftClient, setRuntime, setSiteVersion } from './runtime'

// TODO: Having client be part of the props for the provider is non-ideal.
// However, attempting to pass it via the RSC Page component failed, with errors
// related to not being able to pass a class
type Props = {
  runtime: NextRSCRuntime
  client: MakeswiftClient
  siteVersion: SiteVersion | null
  children: React.ReactNode
}

export function NextRSCServerProvider({ runtime, siteVersion, children, client }: Props) {
  setRuntime(runtime)
  setSiteVersion(siteVersion)
  setMakeswiftClient(client)

  return children
}

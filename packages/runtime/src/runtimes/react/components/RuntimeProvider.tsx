'use client'

import { ReactNode, useMemo, lazy } from 'react'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { ReactRuntime, SerializedServerState } from '../react-runtime'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { type SiteVersion } from '../../../api/site-version'
import { PreviewSwitcher } from './preview-switcher/preview-switcher'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'
import { useFrameworkContext } from './hooks/use-framework-context'

const LiveProvider = lazy(() => import('./LiveProvider'))
const PreviewProvider = lazy(() => import('./PreviewProvider'))

export function RuntimeProvider({
  children,
  runtime,
  serializedServerState,
  siteVersion,
  appOrigin = 'https://app.makeswift.com',
  apiOrigin = 'https://api.makeswift.com',
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntime
  serializedServerState: SerializedServerState
  siteVersion: SiteVersion | null
  apiOrigin?: string
  appOrigin?: string
  locale?: string
}) {
  const { versionedFetch } = useFrameworkContext()

  const client = useMemo(
    () =>
      new MakeswiftHostApiClient({
        uri: new URL('graphql', apiOrigin).href,
        locale,
        fetch: versionedFetch(siteVersion),
      }),
    [apiOrigin, locale, siteVersion, versionedFetch],
  )

  const isPreview = siteVersion != null
  const StoreProvider = isPreview ? PreviewProvider : LiveProvider

  useBuilderConnectionPing({ appOrigin })

  runtime.loadServerState(serializedServerState)

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      <MakeswiftHostApiClientProvider client={client}>
        <StoreProvider>
          {children}
          <PreviewSwitcher isPreview={isPreview} />
        </StoreProvider>
      </MakeswiftHostApiClientProvider>
    </ReactRuntimeContext.Provider>
  )
}

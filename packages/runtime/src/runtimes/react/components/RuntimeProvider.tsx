'use client'

import { ReactNode, useMemo, useRef, lazy } from 'react'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { type ReactRuntimeCore } from '../react-runtime-core'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { type SiteVersion } from '../../../api/site-version'
import { PreviewSwitcher } from './preview-switcher/preview-switcher'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'
import { useFrameworkContext } from './hooks/use-framework-context'

const LiveProvider = lazy(() => import('./LiveProvider'))
const PreviewProvider = lazy(() => import('./PreviewProvider'))

function useStableSiteVersion(siteVersion: SiteVersion | null): SiteVersion | null {
  const ref = useRef(siteVersion)
  if (ref.current?.version !== siteVersion?.version || ref.current?.token !== siteVersion?.token) {
    ref.current = siteVersion
  }
  return ref.current
}

export function RuntimeProvider({
  children,
  runtime,
  siteVersion: siteVersionProp,
  appOrigin = 'https://app.makeswift.com',
  apiOrigin = 'https://api.makeswift.com',
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntimeCore
  siteVersion: SiteVersion | null
  apiOrigin?: string
  appOrigin?: string
  locale?: string
}) {
  const { versionedFetch, previewStoreMiddlewares = [] } = useFrameworkContext()
  const siteVersion = useStableSiteVersion(siteVersionProp)

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

  useBuilderConnectionPing({ appOrigin })

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      <MakeswiftHostApiClientProvider client={client}>
        {isPreview ? (
          <PreviewProvider appOrigin={appOrigin} middlewares={previewStoreMiddlewares}>
            {children}
            <PreviewSwitcher isPreview={true} />
          </PreviewProvider>
        ) : (
          <LiveProvider>
            {children}
            <PreviewSwitcher isPreview={false} />
          </LiveProvider>
        )}
      </MakeswiftHostApiClientProvider>
    </ReactRuntimeContext.Provider>
  )
}

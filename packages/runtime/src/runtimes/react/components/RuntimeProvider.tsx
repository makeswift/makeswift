'use client'

import { ReactNode, useMemo, lazy } from 'react'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { ReactRuntime } from '../react-runtime'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { type SiteVersion } from '../../../api/site-version'
import { DraftSwitcher } from './draft-switcher/draft-switcher'
import { useBuilderHandshake } from './hooks/use-builder-handshake'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'

const LiveProvider = lazy(() => import('./LiveProvider'))
const PreviewProvider = lazy(() => import('./PreviewProvider'))

export function ReactRuntimeProvider({
  children,
  runtime,
  siteVersion,
  appOrigin = 'https://app.makeswift.com',
  apiOrigin = 'https://api.makeswift.com',
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntime
  siteVersion: SiteVersion | null
  apiOrigin?: string
  appOrigin?: string
  locale?: string
}) {
  const client = useMemo(
    () =>
      new MakeswiftHostApiClient({
        uri: new URL('graphql', apiOrigin).href,
        locale,
        siteVersion,
      }),
    [apiOrigin, locale, siteVersion],
  )

  const isDraft = siteVersion != null
  const StoreProvider = isDraft ? PreviewProvider : LiveProvider

  useBuilderHandshake({ appOrigin })
  useBuilderConnectionPing({ appOrigin })

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      <MakeswiftHostApiClientProvider client={client}>
        <StoreProvider>
          {children}
          <DraftSwitcher isDraft={isDraft} />
        </StoreProvider>
      </MakeswiftHostApiClientProvider>
    </ReactRuntimeContext.Provider>
  )
}

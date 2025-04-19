'use client'

import { ReactNode, useMemo } from 'react'
import dynamic from 'next/dynamic'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { ReactRuntime } from '../react-runtime'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { MakeswiftSiteVersion } from '../../../api/site-version'
import { DraftSwitcher } from './draft-switcher/draft-switcher'
import { useBuilderHandshake } from './hooks/use-builder-handshake'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'

const LiveProvider = dynamic(() => import('./LiveProvider'))
const PreviewProvider = dynamic(() => import('./PreviewProvider'))

export function ReactRuntimeProvider({
  children,
  runtime,
  previewMode,
  appOrigin = 'https://app.makeswift.com',
  apiOrigin = 'https://api.makeswift.com',
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntime
  previewMode: boolean
  apiOrigin?: string
  appOrigin?: string
  locale?: string
}) {
  const client = useMemo(
    () =>
      new MakeswiftHostApiClient({
        uri: new URL('graphql', apiOrigin).href,
        locale,
        siteVersion: previewMode ? MakeswiftSiteVersion.Working : MakeswiftSiteVersion.Live,
      }),
    [apiOrigin, locale, previewMode],
  )

  const StoreProvider = previewMode ? PreviewProvider : LiveProvider

  useBuilderHandshake({ appOrigin })
  useBuilderConnectionPing({ appOrigin })

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      <MakeswiftHostApiClientProvider client={client}>
        <StoreProvider>
          {children}
          <DraftSwitcher isDraft={previewMode} />
        </StoreProvider>
      </MakeswiftHostApiClientProvider>
    </ReactRuntimeContext.Provider>
  )
}

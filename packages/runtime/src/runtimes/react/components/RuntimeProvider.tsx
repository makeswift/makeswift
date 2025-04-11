'use client'

import { ReactNode, useMemo } from 'react'
import dynamic from 'next/dynamic'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { ReactRuntime } from '../react-runtime'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { MakeswiftSiteVersion } from '../../../api/site-version'

const LiveProvider = dynamic(() => import('./LiveProvider'))
const PreviewProvider = dynamic(() => import('./PreviewProvider'))

export function ReactRuntimeProvider({
  children,
  runtime,
  previewMode,
  apiOrigin = 'https://api.makeswift.com',
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntime
  previewMode: boolean
  apiOrigin?: string
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

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      <MakeswiftHostApiClientProvider client={client}>
        <StoreProvider>{children}</StoreProvider>
      </MakeswiftHostApiClientProvider>
    </ReactRuntimeContext.Provider>
  )
}

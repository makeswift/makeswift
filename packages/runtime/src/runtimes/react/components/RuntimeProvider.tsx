'use client'

import { ReactNode, useMemo, lazy } from 'react'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { ReactRuntime } from '../react-runtime'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { MakeswiftSiteVersion } from '../../../api/site-version'
import { DraftSwitcher } from './draft-switcher/draft-switcher'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'
import { useFrameworkContext } from './hooks/use-framework-context'

const LiveProvider = lazy(() => import('./LiveProvider'))
const PreviewProvider = lazy(() => import('./PreviewProvider'))

export function RuntimeProvider({
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
  const { versionedFetch } = useFrameworkContext()

  const client = useMemo(
    () =>
      new MakeswiftHostApiClient({
        uri: new URL('graphql', apiOrigin).href,
        locale,
        fetch: versionedFetch(
          previewMode ? MakeswiftSiteVersion.Working : MakeswiftSiteVersion.Live,
        ),
      }),
    [apiOrigin, locale, previewMode, versionedFetch],
  )

  const StoreProvider = previewMode ? PreviewProvider : LiveProvider

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

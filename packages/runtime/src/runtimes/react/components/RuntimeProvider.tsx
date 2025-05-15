'use client'

import { ReactNode, useMemo, lazy } from 'react'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { ReactRuntime } from '../react-runtime'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { MakeswiftSiteVersion } from '../../../api/site-version'
// import { DraftSwitcher } from './draft-switcher/draft-switcher'
import { useBuilderHandshake } from './hooks/use-builder-handshake'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'

const LiveProvider = lazy(() => import('./LiveProvider'))
const PreviewProvider = lazy(() => import('./PreviewProvider'))

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
          {/* DECOUPLE_TODO: TypeError: Cannot read properties of null (reading 'useRef')
            at useRef (/Users/fikri.karim/workspace/makeswift/node_modules/.pnpm/react@18.2.0/node_modules/react/cjs/react.development.js:1630:21)
            at useSyncExternalStoreWithSelector (/Users/fikri.karim/workspace/makeswift/node_modules/.pnpm/use-sync-external-store@1.0.0-rc.0_react@18.2.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js:50:17)
            at useSelector (/Users/fikri.karim/workspace/makeswift/packages/runtime/src/runtimes/react/hooks/use-selector.ts:11:10)
            at useIsInBuilder (/Users/fikri.karim/workspace/makeswift/packages/runtime/src/runtimes/react/hooks/use-is-in-builder.ts:5:10)
            at DraftSwitcher (/Users/fikri.karim/workspace/makeswift/packages/runtime/src/runtimes/react/components/draft-switcher/draft-switcher.tsx:28:10) 
          */}
          {/* <DraftSwitcher isDraft={previewMode} /> */}
        </StoreProvider>
      </MakeswiftHostApiClientProvider>
    </ReactRuntimeContext.Provider>
  )
}

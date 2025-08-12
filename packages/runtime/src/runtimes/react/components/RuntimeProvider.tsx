'use client'

import { ReactNode, useMemo, lazy, useState, useEffect } from 'react'

import { MakeswiftHostApiClient } from '../../../api/react'
import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { ReactRuntime } from '../react-runtime'
import { MakeswiftHostApiClientProvider } from '../host-api-client'
import { MakeswiftSiteVersion } from '../../../api/site-version'
import { DraftSwitcher } from './draft-switcher/draft-switcher'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'
import { MessageChannel } from '../../../state/message-channel'
import { ActionTypes } from '../../../react'

const LiveProvider = lazy(() => import('./LiveProvider'))
const PreviewProvider = lazy(() => import('./PreviewProvider'))

export function RuntimeProvider({
  children,
  runtime,
  appOrigin = 'https://app.makeswift.com',
  apiOrigin = 'https://api.makeswift.com',
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntime
  apiOrigin?: string
  appOrigin?: string
  locale?: string
}) {
  const [previewMode, setPreviewMode] = useState(false)
  const channel = useMemo(() => new MessageChannel(), [])
  const client = useMemo(
    () =>
      new MakeswiftHostApiClient({
        uri: new URL('graphql', apiOrigin).href,
        locale,
        siteVersion: previewMode ? MakeswiftSiteVersion.Working : MakeswiftSiteVersion.Live,
      }),
    [apiOrigin, locale, previewMode],
  )

  useEffect(() => {
    const inIframe = window.self !== window.top
    if (!inIframe) return

    console.log({ inIframe })

    channel.setup(event => {
      console.log('Message received from parent:', event.data)
      if (event.data.type === ActionTypes.INIT) setPreviewMode(true)
    })

    return () => channel.teardown()
  }, [channel])

  console.log({ previewMode })
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

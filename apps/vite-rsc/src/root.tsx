import {
  ExperimentalServerProvider,
  ExperimentalMakeswiftPage,
} from '@makeswift/runtime/next/rsc/server'
import { MakeswiftClientProvider } from './makeswift/provider'

import './makeswift/components.server'
import './makeswift/components.client'
import { runtime } from './makeswift/runtime'
import { client } from './makeswift/client'
import type { SiteVersion } from '@makeswift/express-react'

type Props = { url: URL; siteVersion: SiteVersion | null }

export async function Root(props: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite RSC</title>
      </head>
      <body>
        <ExperimentalServerProvider
          client={client}
          siteVersion={props.siteVersion}
          runtime={runtime}
        >
          <MakeswiftClientProvider
            serializedServerState={runtime.serializeServerState()}
            siteVersion={props.siteVersion}
          >
            <App {...props} />
          </MakeswiftClientProvider>
        </ExperimentalServerProvider>
      </body>
    </html>
  )
}

async function App(props: Props) {
  const snapshot = await client.getPageSnapshot(props.url.pathname, {
    siteVersion: props.siteVersion,
  })

  if (snapshot == null) return <p>Page not found</p>

  return <ExperimentalMakeswiftPage snapshot={snapshot} />
}

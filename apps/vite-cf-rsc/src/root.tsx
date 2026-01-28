import {
  RSCMakeswiftPage,
  RSCServerProvider,
} from '@makeswift/runtime/rsc/server'
import './lib/makeswift/components.server'
import './lib/makeswift/components.client'
import { runtime } from './lib/makeswift/runtime.ts'
import { client } from './lib/makeswift/client.ts'
import { MakeswiftClientProvider } from './lib/makeswift/provider.tsx'

export async function Root() {
  // const siteVersion = await getSiteVersion()
  const siteVersion = null

  return (
    <html>
      <body>
        <RSCServerProvider
          client={client}
          siteVersion={siteVersion}
          runtime={runtime}
        >
          <MakeswiftClientProvider
            serializedServerState={runtime.serializeServerState()}
            siteVersion={siteVersion}
          >
            <App />
          </MakeswiftClientProvider>
        </RSCServerProvider>
      </body>
    </html>
  )
}

async function App() {
  // const params = await props.params
  // const path = '/' + (params?.path ?? []).join('/')
  const siteVersion = null
  const path = '/'
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion,
    // siteVersion: await getSiteVersion(),
  })

  // console.log('snapshot', snapshot)

  if (snapshot == null) return <p>Not found</p>

  return <RSCMakeswiftPage snapshot={snapshot} />
}

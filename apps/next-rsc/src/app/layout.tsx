import { MakeswiftClientProvider } from '@/makeswift/provider'

import '@/app/global.css'
import '@/makeswift/components.server'
import '@/makeswift/components.client'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { runtime } from '@/makeswift/runtime'
import { ExperimentalServerProvider } from '@makeswift/runtime/next/rsc/server'
import { client } from '@/makeswift/client'

type Params = Promise<{ path?: string[] }>

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  const siteVersion = await getSiteVersion()

  return (
    <html>
      <body>
        <ExperimentalServerProvider
          client={client}
          siteVersion={siteVersion}
          runtime={runtime}
        >
          <MakeswiftClientProvider
            serializedServerState={runtime.serializeServerState()}
            siteVersion={siteVersion}
          >
            {children}
          </MakeswiftClientProvider>
        </ExperimentalServerProvider>
      </body>
    </html>
  )
}

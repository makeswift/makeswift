import { MakeswiftProvider } from '@/makeswift/provider'

import '@/app/global.css'
import '@/makeswift/components.server'
import '@/makeswift/components.client'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { setRuntime } from '@makeswift/runtime/next/rsc/server'
import { runtime } from '@/makeswift/runtime'

type Params = Promise<{ path?: string[] }>

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  const siteVersion = await getSiteVersion()
  setRuntime(runtime)

  return (
    <html>
      <body>
        <MakeswiftProvider
          serializedServerState={runtime.serializeServerState()}
          siteVersion={siteVersion}
        >
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}

import {
  RSCMakeswiftPage,
  RSCServerProvider,
} from '@makeswift/runtime/rsc/server'
import './lib/makeswift/components.server'
import './lib/makeswift/components.client'
import { runtime } from './lib/makeswift/runtime.ts'
import { client } from './lib/makeswift/client.ts'
import { MakeswiftClientProvider } from './lib/makeswift/provider.tsx'
import type { ComponentProps } from 'react'

type Props = {
  snapshot: ComponentProps<typeof RSCMakeswiftPage>['snapshot']
  siteVersion: ComponentProps<typeof RSCServerProvider>['siteVersion']
}

export async function Root(props: Props) {
  return (
    <html>
      <body>
        <RSCServerProvider
          client={client}
          siteVersion={props.siteVersion}
          runtime={runtime}
        >
          <MakeswiftClientProvider
            serializedServerState={runtime.serializeServerState()}
            siteVersion={props.siteVersion}
          >
            <RSCMakeswiftPage snapshot={props.snapshot} />
          </MakeswiftClientProvider>
        </RSCServerProvider>
      </body>
    </html>
  )
}

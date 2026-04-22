import {
  RSCMakeswiftComponent,
  RSCServerProvider,
} from '@makeswift/runtime/rsc/server'
import type { MakeswiftComponentSnapshot } from '@makeswift/runtime/client'
import { MakeswiftComponentType } from '@makeswift/runtime/react/builtins'
import './lib/makeswift/components.server'
import './lib/makeswift/components.client'
import { runtime } from './lib/makeswift/runtime.ts'
import { client } from './lib/makeswift/client.ts'
import { MakeswiftClientProvider } from './lib/makeswift/provider.tsx'
import type { ComponentProps } from 'react'

type Props = {
  snapshot: MakeswiftComponentSnapshot
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
            <RSCMakeswiftComponent
              snapshot={props.snapshot}
              label="/"
              type={MakeswiftComponentType.Box}
            />
          </MakeswiftClientProvider>
        </RSCServerProvider>
      </body>
    </html>
  )
}

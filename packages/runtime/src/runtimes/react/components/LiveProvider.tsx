import { ReactNode, useMemo } from 'react'

import { StoreContext, useStore } from '../hooks/use-store'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftHostApiClient } from '../../../api/react'
import { useReactRuntime } from '../../../next/context/react-runtime'
import { MakeswiftHostApiClientProvider } from '../../../next/context/makeswift-host-api-client'

type Props = {
  client: MakeswiftHostApiClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

export default function LiveProvider({ client, children, rootElements }: Props): JSX.Element {
  return <MakeswiftHostApiClientProvider client={client}>{children}</MakeswiftHostApiClientProvider>
}

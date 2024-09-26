import { ReactNode, useMemo } from 'react'

import { StoreContext } from '../hooks/use-store'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftHostApiClient } from '../../../api/react'
import { useReactRuntime } from '../../../next/context/react-runtime'
import { MakeswiftHostApiClientProvider } from '../../../next/context/makeswift-host-api-client'

type Props = {
  client: MakeswiftHostApiClient
  documents?: ReactPage.Document[]
  children?: ReactNode
}

export default function LiveProvider({ client, children, documents }: Props): JSX.Element {
  const runtime = useReactRuntime()
  const store = useMemo(
    () => ReactPage.configureStore({ preloadedState: runtime.store.getState(), documents }),
    [documents, runtime],
  )

  return (
    <StoreContext.Provider value={store}>
      <MakeswiftHostApiClientProvider client={client}>{children}</MakeswiftHostApiClientProvider>
    </StoreContext.Provider>
  )
}

import { ReactNode, useMemo } from 'react'

import { StoreContext } from '../hooks/use-store'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftHostApiClientProvider, MakeswiftHostApiClient } from '../../../api/react'
import { useReactRuntime } from '../../../next/context/react-runtime'

type Props = {
  client: MakeswiftHostApiClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

export default function LiveProvider({ client, children, rootElements }: Props): JSX.Element {
  const runtime = useReactRuntime()
  const store = useMemo(
    () => ReactPage.configureStore({ preloadedState: runtime.store.getState(), rootElements }),
    [rootElements, runtime],
  )

  return (
    <StoreContext.Provider value={store}>
      <MakeswiftHostApiClientProvider client={client}>{children}</MakeswiftHostApiClientProvider>
    </StoreContext.Provider>
  )
}

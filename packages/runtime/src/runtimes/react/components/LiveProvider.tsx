import { ReactNode, useMemo } from 'react'

import { StoreContext } from '..'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftProvider, MakeswiftClient } from '../../../api/react'
import { ReactRuntime } from '../../../react'

type Props = {
  client: MakeswiftClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
  runtime?: ReactRuntime
}

export default function LiveProvider({
  client,
  children,
  rootElements,
  runtime,
}: Props): JSX.Element {
  const store = useMemo(
    () =>
      ReactPage.configureStore({
        preloadedState: runtime ? runtime.store.getState() : ReactRuntime.store.getState(),
        rootElements,
      }),
    [rootElements, runtime],
  )

  return (
    <StoreContext.Provider value={store}>
      <MakeswiftProvider client={client}>{children}</MakeswiftProvider>
    </StoreContext.Provider>
  )
}

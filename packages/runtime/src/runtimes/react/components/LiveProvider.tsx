import { type PropsWithChildren, useMemo } from 'react'
import { type Middleware } from '@reduxjs/toolkit'

import * as ReactPage from '../../../state/react-page'

import { useReactRuntime } from '../hooks/use-react-runtime'
import { StoreContext } from '../hooks/use-store'

export default function LiveProvider({
  children,
  middlewares = [],
}: PropsWithChildren<{
  middlewares?: Middleware<ReactPage.Dispatch, ReactPage.State, ReactPage.Dispatch>[]
}>): JSX.Element {
  const runtime = useReactRuntime()
  const store = useMemo(
    () =>
      ReactPage.configureStore({
        name: 'Host store',
        preloadedState: runtime.store.getState(),
        middlewares,
      }),
    [runtime, middlewares],
  )

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

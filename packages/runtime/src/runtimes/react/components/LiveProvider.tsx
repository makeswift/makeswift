import { type PropsWithChildren, useMemo } from 'react'

import * as ReactPage from '../../../state/react-page'

import { useReactRuntime } from '../hooks/use-react-runtime'
import { StoreContext } from '../hooks/use-store'

export default function LiveProvider({ children }: PropsWithChildren): JSX.Element {
  const runtime = useReactRuntime()
  const store = useMemo(
    () =>
      ReactPage.configureStore({
        name: 'Host store',
        preloadedState: runtime.store.getState(),
      }),
    [runtime],
  )

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

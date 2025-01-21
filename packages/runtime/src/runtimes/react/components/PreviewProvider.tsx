'use client'

import { type PropsWithChildren, useEffect, useMemo } from 'react'

import * as ReactBuilderPreview from '../../../state/react-builder-preview'

import { useReactRuntime } from '../hooks/use-react-runtime'
import { StoreContext } from '../hooks/use-store'
import { useMakeswiftHostApiClient } from '../host-api-client'

export default function PreviewProvider({ children }: PropsWithChildren): JSX.Element {
  const runtime = useReactRuntime()
  const client = useMakeswiftHostApiClient()
  const store = useMemo(
    () =>
      ReactBuilderPreview.configureStore({
        preloadedState: runtime.store.getState(),
        client,
      }),
    [client, runtime],
  )

  useEffect(() => {
    store.setup()
    return () => store.teardown()
  }, [store])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

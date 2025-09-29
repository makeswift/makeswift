'use client'

import { type PropsWithChildren, useEffect, useMemo } from 'react'
import { type Middleware } from '@reduxjs/toolkit'

import * as ReactBuilderPreview from '../../../state/react-builder-preview'

import { useReactRuntime } from '../hooks/use-react-runtime'
import { StoreContext } from '../hooks/use-store'
import { useMakeswiftHostApiClient } from '../host-api-client'

export default function PreviewProvider({
  children,
  middlewares = [],
}: PropsWithChildren<{
  middlewares?: Middleware<
    ReactBuilderPreview.Dispatch,
    ReactBuilderPreview.State,
    ReactBuilderPreview.Dispatch
  >[]
}>): JSX.Element {
  const runtime = useReactRuntime()
  const client = useMakeswiftHostApiClient()

  const store = useMemo(
    () =>
      ReactBuilderPreview.configureStore({
        preloadedState: runtime.store.getState(),
        client,
        middlewares,
      }),
    [client, runtime, middlewares],
  )

  useEffect(() => {
    store.setup()
    return () => store.teardown()
  }, [store])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

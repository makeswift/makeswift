'use client'

import { type PropsWithChildren, useEffect, useMemo } from 'react'

import * as ReactBuilderPreview from '../../../state/react-builder-preview'
import { BuilderAPIProxy } from '../../../state/builder-api/proxy'

import { useReactRuntime } from '../hooks/use-react-runtime'
import { StoreContext } from '../hooks/use-store'
import { useMakeswiftHostApiClient } from '../host-api-client'

export default function PreviewProvider({
  appOrigin,
  children,
}: PropsWithChildren<{ appOrigin: string }>): JSX.Element {
  const runtime = useReactRuntime()
  const client = useMakeswiftHostApiClient()
  const builderProxy = useMemo(() => new BuilderAPIProxy({ appOrigin }), [appOrigin])

  const store = useMemo(
    () =>
      ReactBuilderPreview.configureStore({
        preloadedState: runtime.store.getState(),
        client,
        builderProxy,
      }),
    [runtime, client, builderProxy],
  )

  useEffect(() => {
    store.setup()
    return () => store.teardown()
  }, [store])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

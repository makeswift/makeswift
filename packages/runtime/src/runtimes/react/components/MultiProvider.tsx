'use client'

import { ReactNode, lazy, useEffect, useMemo } from 'react'
import { MakeswiftHostApiClient } from '../../../api/react'
import * as ReactBuilderPreview from '../../../state/react-builder-preview'
import { ReactRuntime } from '../react-runtime'
import { MakeswiftPageSnapshot } from '../../../next'
import { StoreContext } from '../hooks/use-store'
import { useReactRuntime } from '../../../next/context/react-runtime'

type MultiProviderProps = {
  preview: boolean
  snapshot: MakeswiftPageSnapshot
  children?: ReactNode
}

export function MultiProvider({ preview, snapshot, ...props }: MultiProviderProps): JSX.Element {
  const rootElements = new Map()
  const runtime = useReactRuntime()

  const hostClient = useMemo(
    () =>
      new MakeswiftHostApiClient({
        uri: new URL('graphql', snapshot.apiOrigin).href,
        cacheData: snapshot.cacheData,
        localizedResourcesMap: snapshot.localizedResourcesMap,
        locale: snapshot.locale ? new Intl.Locale(snapshot.locale) : undefined,
      }),
    [snapshot],
  )

  const store = useMemo(
    () =>
      ReactBuilderPreview.configureStore({
        preloadedState: runtime ? runtime.store.getState() : ReactRuntime.store.getState(),
        rootElements,
        client: hostClient,
      }),
    [hostClient, rootElements, runtime],
  )

  useEffect(() => {
    if (!preview) return
    store.setup()
    return () => store.teardown()
  }, [store])

  return <StoreContext.Provider value={store} {...props} />
}

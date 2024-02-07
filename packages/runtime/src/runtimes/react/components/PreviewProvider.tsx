'use client'

import { ReactNode, useEffect, useMemo } from 'react'

import { ReactRuntime } from '../react-runtime'
import { StoreContext } from '../hooks/use-store'
import * as ReactBuilderPreview from '../../../state/react-builder-preview'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftProvider, MakeswiftClient } from '../../../api/react'
import { registerDocumentEffect } from '../../../state/actions'
import { useReactRuntime } from '../../../next/context/react-runtime'

type Props = {
  client: MakeswiftClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

export default function PreviewProvider({ client, children, rootElements }: Props): JSX.Element {
  const runtime = useReactRuntime()
  const store = useMemo(
    () =>
      ReactBuilderPreview.configureStore({
        preloadedState: runtime ? runtime.store.getState() : ReactRuntime.store.getState(),
        rootElements,
        client,
      }),
    [client, rootElements, runtime],
  )

  useEffect(() => {
    const unregisterDocuments = Array.from(rootElements?.entries() ?? []).map(
      ([documentKey, rootElement]) =>
        store.dispatch(registerDocumentEffect(ReactPage.createDocument(documentKey, rootElement))),
    )

    return () => {
      unregisterDocuments.forEach(unregisterDocument => {
        unregisterDocument()
      })
    }
  }, [store, rootElements])

  return (
    <StoreContext.Provider value={store}>
      <MakeswiftProvider client={client}>{children}</MakeswiftProvider>
    </StoreContext.Provider>
  )
}

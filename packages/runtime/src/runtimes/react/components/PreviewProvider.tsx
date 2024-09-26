'use client'

import { ReactNode, useEffect, useMemo } from 'react'

import { ReactRuntime } from '../react-runtime'
import { StoreContext } from '../hooks/use-store'
import * as ReactBuilderPreview from '../../../state/react-builder-preview'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftHostApiClient } from '../../../api/react'
import { registerDocumentEffect } from '../../../state/actions'
import { useReactRuntime } from '../../../next/context/react-runtime'
import { MakeswiftHostApiClientProvider } from '../../../next/context/makeswift-host-api-client'

type Props = {
  client: MakeswiftHostApiClient
  documents?: ReactPage.Document[]
  children?: ReactNode
}

export default function PreviewProvider({ client, children, documents }: Props): JSX.Element {
  const runtime = useReactRuntime()
  const store = useMemo(
    () =>
      ReactBuilderPreview.configureStore({
        preloadedState: runtime ? runtime.store.getState() : ReactRuntime.store.getState(),
        documents,
        client,
      }),
    [client, documents, runtime],
  )

  useEffect(() => {
    store.setup()
    return () => store.teardown()
  }, [store])

  useEffect(() => {
    const unregisterDocuments = (documents ?? []).map(document =>
      store.dispatch(registerDocumentEffect(ReactPage.createDocument(document))),
    )

    return () => {
      unregisterDocuments.forEach(unregisterDocument => {
        unregisterDocument()
      })
    }
  }, [store, documents])

  return (
    <StoreContext.Provider value={store}>
      <MakeswiftHostApiClientProvider client={client}>{children}</MakeswiftHostApiClientProvider>
    </StoreContext.Provider>
  )
}

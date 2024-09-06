'use client'

import { ReactNode, useEffect, useMemo } from 'react'

import { ReactRuntime } from '../react-runtime'
import { StoreContext, useStore } from '../hooks/use-store'
import * as ReactBuilderPreview from '../../../state/react-builder-preview'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftHostApiClient } from '../../../api/react'
import { registerDocumentEffect } from '../../../state/actions'
import { useReactRuntime } from '../../../next/context/react-runtime'
import { MakeswiftHostApiClientProvider } from '../../../next/context/makeswift-host-api-client'

type Props = {
  client: MakeswiftHostApiClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

export default function PreviewProvider({ client, children, rootElements }: Props): JSX.Element {
  // const runtime = useReactRuntime()
  const store = useStore()

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

  return <MakeswiftHostApiClientProvider client={client}>{children}</MakeswiftHostApiClientProvider>
}

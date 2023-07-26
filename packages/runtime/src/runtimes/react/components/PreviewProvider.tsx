import { ReactNode, useEffect, useMemo } from 'react'

import { StoreContext, ReactRuntime } from '..'
import * as ReactBuilderPreview from '../../../state/react-builder-preview'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftProvider, MakeswiftClient } from '../../../api/react'
import { registerDocumentEffect } from '../../../state/actions'
import { TranslationContext, TranslationContextType } from '../translation-context'

type Props = {
  client: MakeswiftClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
  runtime?: ReactRuntime
  translations?: TranslationContextType
}

export default function PreviewProvider({
  client,
  children,
  rootElements,
  runtime,
  translations,
}: Props): JSX.Element {
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
      <MakeswiftProvider client={client}>
        <TranslationContext.Provider value={translations}>{children}</TranslationContext.Provider>
      </MakeswiftProvider>
    </StoreContext.Provider>
  )
}

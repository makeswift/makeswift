import { ReactNode, useMemo } from 'react'

import { StoreContext, ReactRuntime } from '..'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftProvider, MakeswiftClient } from '../../../api/react'
import { TranslationContext, TranslationContextType } from '../translation-context'

type Props = {
  client: MakeswiftClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
  runtime?: ReactRuntime
  translations?: TranslationContextType
}

export default function LiveProvider({
  client,
  children,
  rootElements,
  runtime,
  translations,
}: Props): JSX.Element {
  const store = useMemo(
    () =>
      ReactPage.configureStore({
        preloadedState: runtime ? runtime.store.getState() : ReactRuntime.store.getState(),
        rootElements,
      }),
    [rootElements, runtime],
  )

  return (
    <StoreContext.Provider value={store}>
      <MakeswiftProvider client={client}>
        <TranslationContext.Provider value={translations}>{children}</TranslationContext.Provider>
      </MakeswiftProvider>
    </StoreContext.Provider>
  )
}

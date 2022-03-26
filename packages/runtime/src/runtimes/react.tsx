import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  memo,
  ReactNode,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

import * as ReactPage from '../state/react-page'
import type * as ReactBuilderPreview from '../state/react-builder-preview'
import {
  mountComponentEffect,
  registerComponentEffect,
  registerComponentHandleEffect,
  registerReactComponentEffect,
} from '../state/actions'
import type {
  PropControllerDescriptor,
  PropControllerDescriptorValueType,
} from '../prop-controllers'
import { ComponentIcon } from '../state/modules/components-meta'
import { registerBuiltinComponents } from '../components'
import { ApolloProvider, useQuery } from '../api/react'

const contextDefaultValue = ReactPage.configureStore()

export interface ReactRuntime {
  registerComponent<
    P extends Record<string, PropControllerDescriptor>,
    C extends ReactPage.ComponentType<{ [K in keyof P]?: PropControllerDescriptorValueType<P[K]> }>,
  >(
    component: C,
    meta: { type: string; label: string; icon?: ComponentIcon; hidden?: boolean; props?: P },
  ): () => void
}

export function createReactRuntime(store: ReactPage.Store): ReactRuntime {
  return {
    registerComponent(component, { type, label, icon = 'Cube40', hidden = false, props }) {
      const unregisterComponent = store.dispatch(
        registerComponentEffect(type, { label, icon, hidden }, props ?? {}),
      )

      const unregisterReactComponent = store.dispatch(
        registerReactComponentEffect(type, component as unknown as ReactPage.ComponentType),
      )

      return () => {
        unregisterComponent()
        unregisterReactComponent()
      }
    },
  }
}

export const ReactRuntime = createReactRuntime(contextDefaultValue)

const Context = createContext(contextDefaultValue)

type RuntimeProviderProps = {
  defaultRootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
  registerComponents?: (runtime: ReactRuntime) => () => void
  makeswiftApiEndpoint?: string
}

export function RuntimeProvider({
  children,
  defaultRootElements,
  registerComponents,
  makeswiftApiEndpoint,
}: RuntimeProviderProps): JSX.Element {
  const [store, setStore] = useState(() => {
    const store = ReactPage.configureStore({
      preloadedState: contextDefaultValue.getState(),
      rootElements: defaultRootElements,
    })
    const runtime = createReactRuntime(store)

    registerBuiltinComponents(runtime)
    registerComponents?.(runtime)

    return store
  })
  const [client, setClient] = useState(
    new ApolloClient({ uri: makeswiftApiEndpoint, cache: new InMemoryCache() }),
  )

  useEffect(() => {
    setClient(({ cache }) => new ApolloClient({ uri: makeswiftApiEndpoint, cache }))
  }, [makeswiftApiEndpoint])

  useEffect(() => {
    return registerBuiltinComponents(createReactRuntime(store))
  }, [store])

  useEffect(() => {
    return registerComponents?.(createReactRuntime(store))
  }, [store, registerComponents])

  useEffect(() => {
    // TODO(miguel): perform a more robust validation.
    const isInBuilder = window.parent !== window

    if (isInBuilder) setReactBuilderPreviewStore()

    async function setReactBuilderPreviewStore(): Promise<void> {
      const ReactBuilderPreview = await import('../state/react-builder-preview')

      setStore(store =>
        ReactBuilderPreview.configureStore({ preloadedState: store.getState(), client }),
      )
    }
  }, [client])

  useEffect(() => {
    // TODO(miguel): perform a more robust validation.
    const isInBuilder = window.parent !== window

    if (!isInBuilder) return

    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handlefocusOut)

    return () => {
      window.addEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handlefocusOut)
    }

    function handleFocusIn(event: FocusEvent) {
      if (!(event.target instanceof window.HTMLElement) || !event.target.isContentEditable) {
        window.parent.focus()
      }
    }

    function handlefocusOut(event: FocusEvent) {
      if (
        !(event.relatedTarget instanceof window.HTMLElement) ||
        !event.relatedTarget.isContentEditable
      ) {
        window.parent.focus()
      }
    }
  }, [])

  return (
    <Context.Provider value={store}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </Context.Provider>
  )
}

const PageContext = createContext<string | null>(null)

function usePageIdOrNull(): string | null {
  return useContext(PageContext)
}

export function usePageId(): string {
  const pageIdOrNull = usePageIdOrNull()

  if (pageIdOrNull == null) throw new Error('`usePageId` must be used with `<PageProvider>`')

  return pageIdOrNull
}

type PageProviderProps = {
  id: string
  children: ComponentPropsWithoutRef<typeof PageContext['Provider']>['children']
}

export function PageProvider({ id, children }: PageProviderProps) {
  return <PageContext.Provider value={id}>{children}</PageContext.Provider>
}

const DocumentContext = createContext<string | null>(null)

function useDocumentKey(): string | null {
  return useContext(DocumentContext)
}

type State = ReactPage.State | ReactBuilderPreview.State

function useSelector<R>(selector: (state: State) => R): R {
  const store = useContext(Context)

  return useSyncExternalStoreWithSelector(store.subscribe, store.getState, store.getState, selector)
}

function useComponent(type: string): ReactPage.ComponentType | null {
  return useSelector(state => ReactPage.getReactComponent(state, type))
}

export function useElementId(elementKey: string | null | undefined): string | null {
  const documentKey = useDocumentKey()

  return useSelector(state =>
    documentKey == null || elementKey == null
      ? null
      : ReactPage.getElementId(state, documentKey, elementKey),
  )
}

function useDocument(documentKey: string): ReactPage.Document | null {
  return useSelector(state => ReactPage.getDocument(state, documentKey))
}

export function useIsInBuilder(): boolean {
  return useSelector(state => ReactPage.getIsInBuilder(state))
}

type Dispatch = ReactPage.Dispatch & ReactBuilderPreview.Dispatch

function useDispatch(): Dispatch {
  const store = useContext(Context)

  return store.dispatch
}

type ElementDataProps = {
  elementData: ReactPage.ElementData
}

const ElementData = memo(
  forwardRef(function ElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const Component = useComponent(elementData.type)

    if (Component == null) {
      return (
        <div ref={ref as Ref<HTMLDivElement>}>
          <p>Component Not Found</p>
          <pre>
            <code>{JSON.stringify(elementData, null, 2)}</code>
          </pre>
        </div>
      )
    }

    return <Component {...elementData.props} key={elementData.key} ref={ref} />
  }),
)

type ElementRefereceProps = {
  elementReference: ReactPage.ElementReference
}

const ElementReference = memo(
  forwardRef(function ElementReference(
    { elementReference }: ElementRefereceProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const { error, data } = useQuery(
      gql`
        query ElementReferenceGlobalElement($id: ID!) {
          globalElement(id: $id) {
            id
            data
          }
        }
      `,
      { variables: { id: elementReference.value } },
    )
    const globalElementData = data?.globalElement?.data as ReactPage.ElementData | undefined
    const elementReferenceDocument = useDocument(elementReference.key)

    if (error != null) {
      return (
        <div ref={ref as Ref<HTMLDivElement>}>
          <p>Something went wrong!</p>
          <pre>
            <code>{JSON.stringify(error, null, 2)}</code>
          </pre>
        </div>
      )
    }

    if (globalElementData == null) {
      return (
        <div ref={ref as Ref<HTMLDivElement>}>
          <p>Not Found</p>
          <pre>
            <code>{JSON.stringify(elementReference, null, 2)}</code>
          </pre>
        </div>
      )
    }

    return elementReferenceDocument != null ? (
      <Document document={elementReferenceDocument} ref={ref} />
    ) : (
      <ElementData elementData={globalElementData} ref={ref} />
    )
  }),
)

type ElementProps = {
  element: ReactPage.Element
}

export const Element = memo(
  forwardRef(function Element({ element }: ElementProps, ref: Ref<unknown>): JSX.Element {
    const elementKey = element.key
    const dispatch = useDispatch()
    const documentKey = useDocumentKey()
    const [handle, setHandle] = useState<unknown>(null)

    useImperativeHandle(ref, () => handle, [handle])

    useEffect(() => {
      if (documentKey == null) return

      return dispatch(registerComponentHandleEffect(documentKey, elementKey, handle))
    }, [dispatch, documentKey, elementKey, handle])

    useEffect(() => {
      if (documentKey == null) return

      return dispatch(mountComponentEffect(documentKey, elementKey))
    }, [dispatch, documentKey, elementKey])

    return ReactPage.isElementReference(element) ? (
      <ElementReference key={elementKey} ref={setHandle} elementReference={element} />
    ) : (
      <ElementData key={elementKey} ref={setHandle} elementData={element} />
    )
  }),
)

type DocumentProps = {
  document: ReactPage.Document
}

const Document = memo(
  forwardRef(function Document({ document }: DocumentProps, ref: Ref<unknown>): JSX.Element {
    return (
      <DocumentContext.Provider value={document.key}>
        <Element ref={ref} element={document.rootElement} />
      </DocumentContext.Provider>
    )
  }),
)

type DocumentReferenceProps = {
  documentReference: ReactPage.DocumentReference
}

export const DocumentReference = memo(
  forwardRef(function DocumentReference(
    { documentReference }: DocumentReferenceProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const document = useDocument(documentReference.key)

    if (document == null) {
      return (
        <div ref={ref as Ref<HTMLDivElement>}>
          <p>Document Not Found</p>
          <pre>
            <code>{JSON.stringify(documentReference, null, 2)}</code>
          </pre>
        </div>
      )
    }

    return <Document ref={ref} document={document} />
  }),
)

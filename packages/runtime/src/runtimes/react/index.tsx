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
  useRef,
  useState,
} from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'
import { gql } from '@apollo/client'

import * as ReactPage from '../../state/react-page'
import type * as ReactBuilderPreview from '../../state/react-builder-preview'
import {
  mountComponentEffect,
  registerComponentEffect,
  registerComponentHandleEffect,
  registerDocumentEffect,
  registerReactComponentEffect,
} from '../../state/actions'
import type {
  PropControllerDescriptor,
  PropControllerDescriptorValueType,
} from '../../prop-controllers'
import { ComponentIcon } from '../../state/modules/components-meta'
import { registerBuiltinComponents } from '../../components'
import { MakeswiftProvider, MakeswiftClient, useQuery } from '../../api/react'
import { FallbackComponent } from '../../components/shared/FallbackComponent'
import { useProps } from './controls'
import { FindDomNode } from './find-dom-node'

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
  client: MakeswiftClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

export function RuntimeProvider({
  client,
  children,
  rootElements,
}: RuntimeProviderProps): JSX.Element {
  const [store, setStore] = useState(() => {
    const store = ReactPage.configureStore({
      preloadedState: contextDefaultValue.getState(),
      rootElements,
    })
    const runtime = createReactRuntime(store)

    registerBuiltinComponents(runtime)

    return store
  })

  useEffect(() => {
    return registerBuiltinComponents(createReactRuntime(store))
  }, [store])

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

  useEffect(() => {
    // TODO(miguel): perform a more robust validation.
    const isInBuilder = window.parent !== window

    if (isInBuilder) setReactBuilderPreviewStore()

    async function setReactBuilderPreviewStore(): Promise<void> {
      const ReactBuilderPreview = await import('../../state/react-builder-preview')

      setStore(store =>
        ReactBuilderPreview.configureStore({
          preloadedState: store.getState(),
          client: client.apolloClient,
        }),
      )
    }
  }, [client])

  return (
    <Context.Provider value={store}>
      <MakeswiftProvider client={client}>{children}</MakeswiftProvider>
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

export function useStore(): ReactPage.Store {
  return useContext(Context)
}

function useSelector<R>(selector: (state: State) => R): R {
  const store = useStore()

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

function useSuppressRefWarning(ownerName: string) {
  const originalErrorRef = useRef(console.error)
  const patchedRef = useRef(false)

  if (patchedRef.current === false) {
    console.error = (...args) => {
      const [msg, ...substitutions] = args
      const text = substitutions.reduce(
        (text, substitution) => text.replace('%s', substitution),
        msg,
      )

      if (
        !text.includes('Function components cannot be given refs.') ||
        !text.includes(`Check the render method of \`${ownerName}\`.`)
      ) {
        originalErrorRef.current(...args)
      }
    }

    patchedRef.current = true
  }
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
    const props = useProps(elementData)
    const [handle, setHandle] = useState<unknown | null>(null)
    const [foundDomNode, setFoundDomNode] = useState<Element | Text | null>(null)

    useImperativeHandle(ref, () => handle ?? foundDomNode, [handle, foundDomNode])

    useSuppressRefWarning(`\`ForwardRef(${ElementData.name})\``)

    if (Component == null) {
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    return (
      <FindDomNode ref={setFoundDomNode}>
        <Component {...props} key={elementData.key} ref={setHandle} />
      </FindDomNode>
    )
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
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Something went wrong!" />
    }

    if (globalElementData == null) {
      return (
        <FallbackComponent
          ref={ref as Ref<HTMLDivElement>}
          text="This global component doesn't exist"
        />
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
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Document not found" />
    }

    return <Document ref={ref} document={document} />
  }),
)

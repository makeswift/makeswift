import {
  createContext,
  forwardRef,
  memo,
  ReactNode,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'

import * as ReactPage from '../state/react-page'
import type * as ReactBuilderPreview from '../state/react-builder-preview'
import {
  changeComponentHandle,
  mountComponentEffect,
  registerComponentEffect,
  registerReactComponentEffect,
} from '../state/actions'
import type {
  PropControllerDescriptor,
  PropControllerDescriptorValueType,
} from '../prop-controllers'
import { ComponentIcon } from '../state/modules/components-meta'

const contextDefaultValue = ReactPage.configureStore()

export const ReactRuntime = {
  registerComponent<
    P extends Record<string, PropControllerDescriptor>,
    C extends ReactPage.ComponentType<{ [K in keyof P]?: PropControllerDescriptorValueType<P[K]> }>,
  >(
    component: C,
    {
      type,
      label,
      icon = 'Cube40',
      hidden = false,
      props,
    }: { type: string; label: string; icon?: ComponentIcon; hidden?: boolean; props?: P },
  ): () => void {
    const unregisterComponent = contextDefaultValue.dispatch(
      registerComponentEffect(type, { label, icon, hidden }, props ?? {}),
    )

    const unregisterReactComponent = contextDefaultValue.dispatch(
      registerReactComponentEffect(type, component as unknown as ReactPage.ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  },
}

const Context = createContext(contextDefaultValue)

type RuntimeProviderProps = {
  defaultRootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

export function RuntimeProvider({
  children,
  defaultRootElements,
}: RuntimeProviderProps): JSX.Element {
  const [store, setStore] = useState(() =>
    ReactPage.configureStore({
      preloadedState: contextDefaultValue.getState(),
      rootElements: defaultRootElements,
    }),
  )

  useEffect(() => {
    // TODO(miguel): perform a more robust validation.
    const isInBuilder = window.parent !== window

    if (!isInBuilder) return

    const initializePromise = initializeReactBuilderPreview()

    return () => {
      initializePromise.then(cleanUp => {
        cleanUp()
      })
    }

    async function initializeReactBuilderPreview(): Promise<() => void> {
      const ReactBuilderPreview = await import('../state/react-builder-preview')

      const store = await new Promise<ReactBuilderPreview.Store>(resolve => {
        setStore(store => {
          const nextStore = ReactBuilderPreview.configureStore({ preloadedState: store.getState() })

          resolve(nextStore)

          return nextStore
        })
      })

      return store.dispatch(ReactBuilderPreview.initialize())
    }
  }, [])

  return <Context.Provider value={store}>{children}</Context.Provider>
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

function useDocumentRootElement(documentKey: string): ReactPage.Element | null {
  return useSelector(state => ReactPage.getDocumentRootElement(state, documentKey))
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
    return (
      <div ref={ref as Ref<HTMLDivElement>}>
        <p>Not Implemented</p>
        <pre>
          <code>{JSON.stringify(elementReference, null, 2)}</code>
        </pre>
      </div>
    )
  }),
)

type ElementProps = {
  element: ReactPage.Element
}

export const Element = memo(function Element({ element }: ElementProps): JSX.Element {
  const elementKey = element.key
  const dispatch = useDispatch()
  const documentKey = useDocumentKey()
  const ref = useCallback(
    (handle: unknown): void => {
      if (documentKey) dispatch(changeComponentHandle(documentKey, elementKey, handle))
    },
    [dispatch, elementKey],
  )

  useEffect(() => {
    if (documentKey == null) return

    return dispatch(mountComponentEffect(documentKey, elementKey))
  }, [dispatch, documentKey, elementKey])

  return ReactPage.isElementReference(element) ? (
    <ElementReference key={elementKey} ref={ref} elementReference={element} />
  ) : (
    <ElementData key={elementKey} ref={ref} elementData={element} />
  )
})

type DocumentProps = {
  documentKey: string
}

export const Document = memo(function Document({ documentKey }: DocumentProps): JSX.Element {
  const documentRootElement = useDocumentRootElement(documentKey)

  if (documentRootElement == null) {
    return (
      <div>
        <p>Document Not Found</p>
        <pre>
          <code>{JSON.stringify({ documentKey }, null, 2)}</code>
        </pre>
      </div>
    )
  }

  return (
    <DocumentContext.Provider value={documentKey}>
      <Element element={documentRootElement} />
    </DocumentContext.Provider>
  )
})

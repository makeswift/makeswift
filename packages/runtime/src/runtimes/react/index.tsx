import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  memo,
  ReactNode,
  Ref,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'
import dynamic from 'next/dynamic'

import * as ReactPage from '../../state/react-page'
import type * as ReactBuilderPreview from '../../state/react-builder-preview'
import {
  mountComponentEffect,
  registerComponentEffect,
  registerComponentHandleEffect,
  registerReactComponentEffect,
  setBreakpoints,
} from '../../state/actions'
import type {
  PropControllerDescriptor,
  PropControllerDescriptorValueType,
} from '../../prop-controllers'
import { ComponentIcon } from '../../state/modules/components-meta'
import { registerBuiltinComponents } from '../../components/builtin/register'
import { MakeswiftClient } from '../../api/react'
import { FallbackComponent } from '../../components/shared/FallbackComponent'
import { PropsValue } from './controls'
import { FindDomNode } from './find-dom-node'
import { useGlobalElement } from './hooks/makeswift-api'
import { ElementImperativeHandle } from './element-imperative-handle'
import { BuilderEditMode } from '../../state/modules/builder-edit-mode'
import {
  Breakpoints,
  BreakpointsInput,
  parseBreakpointsInput,
} from '../../state/modules/breakpoints'

export const storeContextDefaultValue = ReactPage.configureStore()

export interface ReactRuntime {
  registerComponent<
    P extends Record<string, PropControllerDescriptor>,
    C extends ReactPage.ComponentType<{ [K in keyof P]: PropControllerDescriptorValueType<P[K]> }>,
  >(
    component: C,
    meta: { type: string; label: string; icon?: ComponentIcon; hidden?: boolean; props?: P },
  ): () => void
  copyElementTree(
    elementTree: ReactPage.ElementData,
    replacementContext: ReactPage.SerializableReplacementContext,
  ): ReactPage.Element
  getBreakpoints(): Breakpoints
  unstable_setBreakpoints(breakpoints: BreakpointsInput): void
}

function createReactRuntime(store: ReactPage.Store): ReactRuntime {
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
    copyElementTree(
      elementTree: ReactPage.ElementData,
      replacementContext: ReactPage.SerializableReplacementContext,
    ) {
      return ReactPage.copyElementTree(store.getState(), elementTree, replacementContext)
    },
    getBreakpoints() {
      return ReactPage.getBreakpoints(store.getState())
    },
    unstable_setBreakpoints(breakpoints: BreakpointsInput) {
      return store.dispatch(setBreakpoints(parseBreakpointsInput(breakpoints)))
    },
  }
}

export const ReactRuntime = createReactRuntime(storeContextDefaultValue)

registerBuiltinComponents(ReactRuntime)

export const StoreContext = createContext(storeContextDefaultValue)

type RuntimeProviderProps = {
  client: MakeswiftClient
  preview: boolean
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

const PreviewProvider = dynamic(() => import('./components/PreviewProvider'))
const LiveProvider = dynamic(() => import('./components/LiveProvider'))

export function RuntimeProvider({ preview, ...props }: RuntimeProviderProps): JSX.Element {
  return preview ? <PreviewProvider {...props} /> : <LiveProvider {...props} />
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

export function useDocumentKey(): string | null {
  return useContext(DocumentContext)
}

/**
 * @note Instead of leveraging `DocumentContext` to detect cycles we have to use a separate
 * construct because not all global element documents are wrapped in `DocumentContext.Provider`. The
 * reason for this is to maintain legacy behavior where we don't register the elements in a global
 * element's document so that they're not selectable. This is clearly suboptimal and the ideal
 * scenario would be to have the builder be aware of multiple documents and only show telegraphs
 * for the document that's currently "active".
 */
const DocumentCyclesContext = createContext<string[]>([])

type State = ReactPage.State | ReactBuilderPreview.State

export function useStore(): ReactPage.Store {
  return useContext(StoreContext)
}

export function useSelector<R>(selector: (state: State) => R): R {
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

export function useIsPreview(): boolean {
  return useSelector(state => ReactPage.getIsPreview(state))
}

export function useBuilderEditMode(): BuilderEditMode | null {
  return useSelector(state => ReactPage.getBuilderEditMode(state))
}

export function useBreakpoints(): Breakpoints {
  return useSelector(state => ReactPage.getBreakpoints(state))
}

type Dispatch = ReactPage.Dispatch & ReactBuilderPreview.Dispatch

function useDispatch(): Dispatch {
  const store = useContext(StoreContext)

  return store.dispatch
}

const originalError = console.error
let patched = false

/**
 * @see https://github.com/facebook/react/blob/a2505792ed17fd4d7ddc69561053c3ac90899491/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1814-L1890
 */
function suppressRefWarning(ownerName: string): void {
  if (patched === false) {
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Function components cannot be given refs.') &&
        args[0].includes(`Check the render method of \`${ownerName}\`.`)
      ) {
        return
      }

      return originalError(...args)
    }

    patched = true
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

    suppressRefWarning(`\`ForwardRef(${ElementData.name})\``)

    if (Component == null) {
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    return (
      <Suspense>
        <PropsValue element={elementData}>
          {props => <Component {...props} key={elementData.key} ref={ref} />}
        </PropsValue>
      </Suspense>
    )
  }),
)

const DisableRegisterElement = createContext(false)

type ElementRefereceProps = {
  elementReference: ReactPage.ElementReference
}

const ElementReference = memo(
  forwardRef(function ElementReference(
    { elementReference }: ElementRefereceProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const globalElement = useGlobalElement(elementReference.value)
    const globalElementData = globalElement?.data as ReactPage.ElementData | undefined
    const elementReferenceDocument = useDocument(elementReference.key)
    const documentKey = elementReference.key
    const documentKeys = useContext(DocumentCyclesContext)
    const providedDocumentKeys = useMemo(
      () => [...documentKeys, documentKey],
      [documentKeys, documentKey],
    )

    if (globalElementData == null) {
      return (
        <FallbackComponent
          ref={ref as Ref<HTMLDivElement>}
          text="This global component doesn't exist"
        />
      )
    }

    if (documentKeys.includes(documentKey)) {
      return (
        <FallbackComponent
          ref={ref as Ref<HTMLDivElement>}
          text="This global component contains itself!"
        />
      )
    }

    return (
      <DocumentCyclesContext.Provider value={providedDocumentKeys}>
        {elementReferenceDocument != null ? (
          <Document document={elementReferenceDocument} ref={ref} />
        ) : (
          <DisableRegisterElement.Provider value={true}>
            <ElementData elementData={globalElementData} ref={ref} />
          </DisableRegisterElement.Provider>
        )}
      </DocumentCyclesContext.Provider>
    )
  }),
)

type ElementProps = {
  element: ReactPage.Element
}

export const Element = memo(
  forwardRef(function Element(
    { element }: ElementProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const elementKey = element.key
    const dispatch = useDispatch()
    const documentKey = useDocumentKey()
    const useFindDomNodeRef = useRef(true)
    const imperativeHandleRef = useRef(new ElementImperativeHandle())
    const findDomNodeCallbackRef = useCallback((current: (() => Element | Text | null) | null) => {
      if (useFindDomNodeRef.current === true) {
        imperativeHandleRef.current.callback(() => current?.() ?? null)
      }
    }, [])
    const elementCallbackRef = useCallback((current: unknown | null) => {
      useFindDomNodeRef.current = false

      imperativeHandleRef.current.callback(() => current)
    }, [])
    const isRegisterElementDisabled = useContext(DisableRegisterElement)

    useImperativeHandle(ref, () => imperativeHandleRef.current, [])

    useEffect(() => {
      if (documentKey == null || isRegisterElementDisabled) return

      return dispatch(
        registerComponentHandleEffect(documentKey, elementKey, imperativeHandleRef.current),
      )
    }, [dispatch, documentKey, elementKey, isRegisterElementDisabled])

    useEffect(() => {
      if (documentKey == null || isRegisterElementDisabled) return

      return dispatch(mountComponentEffect(documentKey, elementKey))
    }, [dispatch, documentKey, elementKey, isRegisterElementDisabled])

    return (
      <FindDomNode ref={findDomNodeCallbackRef}>
        {ReactPage.isElementReference(element) ? (
          <ElementReference key={elementKey} ref={elementCallbackRef} elementReference={element} />
        ) : (
          <ElementData key={elementKey} ref={elementCallbackRef} elementData={element} />
        )}
      </FindDomNode>
    )
  }),
)

type DocumentProps = {
  document: ReactPage.Document
}

const Document = memo(
  forwardRef(function Document(
    { document }: DocumentProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
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
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const document = useDocument(documentReference.key)

    if (document == null) {
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Document not found" />
    }

    return <Document ref={ref} document={document} />
  }),
)

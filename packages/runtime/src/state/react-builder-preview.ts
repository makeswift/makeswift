import {
  configureStore as configureReduxStore,
  combineReducers,
  type Middleware,
  type ThunkAction,
  type ThunkDispatch,
} from '@reduxjs/toolkit'

import { ControlInstance } from '@makeswift/controls'

import deepEqual from '../utils/deepEqual'

import * as Documents from './modules/read-write-documents'
import * as ElementTrees from './modules/element-trees'
import * as ReactComponents from './modules/react-components'
import * as BoxModels from './modules/box-models'
import * as ComponentsMeta from './modules/components-meta'
import * as PropControllers from './modules/prop-controllers'
import * as PropControllerHandles from './modules/prop-controller-handles'
import * as IsInBuilder from './modules/is-in-builder'
import * as IsPreview from './modules/is-preview'
import * as BuilderEditMode from './modules/builder-edit-mode'
import * as Pointer from './modules/pointer'
import * as ElementImperativeHandles from './modules/element-imperative-handles'
import * as Breakpoints from './modules/breakpoints'

import { withSetupTeardown } from './mixins/setup-teardown'

import * as ReactPage from './react-page'
import { type Action } from './actions'

import * as Shared from './shared-api'

import { BuilderActionTypes } from './builder-api/actions'
import * as Builder from './builder-api/actions'

import { InternalActionTypes } from './actions/internal'
import * as Internal from './actions/internal'

import { actionMiddleware, middlewareOptions, devToolsConfig } from './toolkit'

import { createPropController } from '../prop-controllers/instances'
import { serializeControls } from '../builder'
import { MakeswiftHostApiClient } from '../api/react'
import { ElementImperativeHandle } from '../runtimes/react/element-imperative-handle'
import { type BuilderAPIProxy } from './builder-api/proxy'
import { HostActionTypes } from './host-api'

export type { Operation } from './modules/read-write-documents'
export type { BoxModelHandle } from './modules/box-models'
export { createBox, getBox, parse } from './modules/box-models'

export const reducer = combineReducers({
  documents: Documents.reducer,
  elementTrees: ElementTrees.reducer,
  reactComponents: ReactComponents.reducer,
  boxModels: BoxModels.reducer,
  componentsMeta: ComponentsMeta.reducer,
  propControllers: PropControllers.reducer,
  propControllerHandles: PropControllerHandles.reducer,
  isInBuilder: IsInBuilder.reducer,
  isPreview: IsPreview.reducer,
  builderEditMode: BuilderEditMode.reducer,
  pointer: Pointer.reducer,
  elementImperativeHandles: ElementImperativeHandles.reducer,
  breakpoints: Breakpoints.reducer,
})

export type State = ReturnType<typeof reducer>
export type Dispatch = ThunkDispatch<State, unknown, Action>

function getDocumentsStateSlice(state: State): Documents.State {
  return state.documents
}

function getBoxModelsStateSlice(state: State): BoxModels.State {
  return state.boxModels
}

function getMeasurables(state: State): Map<string, Map<string, BoxModels.Measurable>> {
  return BoxModels.getMeasurables(getBoxModelsStateSlice(state))
}

function getBoxModels(state: State): Map<string, Map<string, BoxModels.BoxModel>> {
  return BoxModels.getBoxModels(getBoxModelsStateSlice(state))
}

function getBoxModel(
  state: State,
  documentKey: string,
  elementKey: string,
): BoxModels.BoxModel | null {
  return BoxModels.getBoxModel(getBoxModelsStateSlice(state), documentKey, elementKey)
}

function getComponentsMetaStateSlice(state: State): ComponentsMeta.State {
  return state.componentsMeta
}

function getComponentsMeta(state: State): Map<string, ComponentsMeta.ComponentMeta> {
  return ComponentsMeta.getComponentsMeta(getComponentsMetaStateSlice(state))
}

function getPropControllersStateSlice(state: State): PropControllers.State {
  return state.propControllers
}

function getComponentPropControllerDescriptors(
  state: State,
  componentType: string,
): Record<string, PropControllers.PropControllerDescriptor> | null {
  return PropControllers.getComponentPropControllerDescriptors(
    getPropControllersStateSlice(state),
    componentType,
  )
}

function getPropControllerHandlesStateSlice(state: State): PropControllerHandles.State {
  return state.propControllerHandles
}

function getPointer(state: State): Pointer.Point | null {
  return Pointer.getPointer(state.pointer)
}

function getElementImperativeHandles(
  state: State,
): Map<string, Map<string, ElementImperativeHandle>> {
  return ElementImperativeHandles.getElementImperativeHandles(state.elementImperativeHandles)
}

function getElementImperativeHandlesContainingElement(
  state: State,
  element: Element,
): Map<string, Map<string, ElementImperativeHandle>> {
  const elementImperativeHandles = getElementImperativeHandles(state)
  const filteredElementImperativeHandles = new Map<string, Map<string, ElementImperativeHandle>>()

  for (const [documentKey, byElementKey] of elementImperativeHandles) {
    const filteredByElementKey = new Map<string, ElementImperativeHandle>()

    for (const [elementKey, elementImperativeHandle] of byElementKey) {
      const handleElement = elementImperativeHandle.getDomNode()

      if (handleElement?.contains(element)) {
        filteredByElementKey.set(elementKey, elementImperativeHandle)
      }
    }

    if (filteredByElementKey.size > 0) {
      filteredElementImperativeHandles.set(documentKey, filteredByElementKey)
    }
  }

  return filteredElementImperativeHandles
}

function measureElements(): ThunkAction<void, State, unknown, Action> {
  return (dispatch, getState) => {
    const measurables = getMeasurables(getState())
    const currentBoxModels = getBoxModels(getState())
    const measuredBoxModels = new Map<string, Map<string, BoxModels.BoxModel>>()

    measurables.forEach((documentMeasurables, documentKey) => {
      const measuredDocumentBoxModels = new Map<string, BoxModels.BoxModel>()

      documentMeasurables.forEach((measurable, elementKey) => {
        const boxModel = BoxModels.measure(measurable)

        if (boxModel != null) measuredDocumentBoxModels.set(elementKey, boxModel)
      })

      if (measuredDocumentBoxModels.size > 0) {
        measuredBoxModels.set(documentKey, measuredDocumentBoxModels)
      }
    })

    const changedBoxModels = new Map<string, Map<string, BoxModels.BoxModel | null>>()

    currentBoxModels.forEach((currentDocumentBoxModels, documentKey) => {
      const changedDocumentBoxModels = new Map<string, BoxModels.BoxModel | null>()

      currentDocumentBoxModels.forEach((_boxModel, elementKey) => {
        if (!measuredBoxModels.get(documentKey)?.has(elementKey)) {
          changedDocumentBoxModels.set(elementKey, null)
        }

        if (changedDocumentBoxModels.size > 0) {
          changedBoxModels.set(documentKey, changedDocumentBoxModels)
        }
      })
    })

    measuredBoxModels.forEach((measuredDocumentBoxModels, documentKey) => {
      const changedDocumentBoxModels = new Map<string, BoxModels.BoxModel | null>()

      measuredDocumentBoxModels.forEach((measuredBoxModel, elementKey) => {
        const currentBoxModel = getBoxModel(getState(), documentKey, elementKey)

        if (currentBoxModel == null || !deepEqual(currentBoxModel, measuredBoxModel)) {
          changedDocumentBoxModels.set(elementKey, measuredBoxModel)
        }
      })

      if (changedDocumentBoxModels.size > 0) {
        changedBoxModels.set(documentKey, changedDocumentBoxModels)
      }
    })

    if (changedBoxModels.size > 0) dispatch(Builder.changeElementBoxModels(changedBoxModels))
  }
}

export function startMeasuringElements(): ThunkAction<() => void, State, unknown, Action> {
  return dispatch => {
    let animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)

    return () => {
      cancelAnimationFrame(animationFrameHandle)
    }

    function handleAnimationFrameRequest() {
      dispatch(measureElements())

      animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)
    }
  }
}

export type Size = {
  offsetWidth: number
  offsetHeight: number
  clientWidth: number
  clientHeight: number
  scrollWidth: number
  scrollHeight: number
  scrollTop: number
  scrollLeft: number
}

function getElementSize(element: HTMLElement): Size {
  return {
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
    scrollTop: element.scrollTop,
    scrollLeft: element.scrollLeft,
  }
}

function lockDocumentScroll(): ThunkAction<() => void, State, unknown, Action> {
  return dispatch => {
    const lastDocumentOverflow = window.document.documentElement.style.overflow
    window.document.documentElement.style.overflow = 'hidden'

    window.document.documentElement.addEventListener('wheel', handleWheelEvent)

    return () => {
      window.document.documentElement.style.overflow = lastDocumentOverflow
      window.document.documentElement.removeEventListener('wheel', handleWheelEvent)
    }

    function handleWheelEvent({ deltaX, deltaY }: WheelEvent) {
      dispatch(Builder.handleWheel({ deltaX, deltaY }))
    }
  }
}

function startHandlingPointerMoveEvent(): ThunkAction<() => void, State, unknown, Action> {
  return dispatch => {
    window.document.documentElement.addEventListener('pointermove', handlePointerMoveEvent)

    return () => {
      window.document.documentElement.removeEventListener('pointermove', handlePointerMoveEvent)
    }

    function handlePointerMoveEvent({ clientX, clientY }: PointerEvent) {
      dispatch(Builder.handlePointerMove({ clientX, clientY }))
    }
  }
}

function startHandlingFocusEvents(): ThunkAction<() => void, State, unknown, Action> {
  return (_dispatch, getState) => {
    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handleFocusOut)

    return () => {
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handleFocusOut)
    }

    function handleFocusIn(event: FocusEvent) {
      if (ReactPage.getBuilderEditMode(getState()) === BuilderEditMode.BuilderEditMode.INTERACT) {
        return
      }

      if (!(event.target instanceof window.HTMLElement) || !event.target.isContentEditable) {
        window.parent.focus()
      }
    }

    function handleFocusOut(event: FocusEvent) {
      if (ReactPage.getBuilderEditMode(getState()) === BuilderEditMode.BuilderEditMode.INTERACT) {
        return
      }

      if (
        !(event.relatedTarget instanceof window.HTMLElement) ||
        !event.relatedTarget.isContentEditable
      ) {
        window.parent.focus()
      }
    }
  }
}

function startMeasuringDocumentElement(): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    let animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)
    let lastSize: Size

    return () => {
      cancelAnimationFrame(animationFrameHandle)
    }

    function handleAnimationFrameRequest() {
      const nextSize = getElementSize(window.document.documentElement)

      if (!deepEqual(lastSize, nextSize)) {
        lastSize = nextSize

        dispatch(Builder.changeDocumentElementSize(nextSize))
      }

      animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)
    }
  }
}

function elementKeysFromElementFromPoint(
  elementFromPoint: Element | null,
): ThunkAction<{ documentKey: string; elementKey: string } | null, State, unknown, Action> {
  return (_dispatch, getState) => {
    if (elementFromPoint == null) return null

    const elementImperativeHandles = getElementImperativeHandlesContainingElement(
      getState(),
      elementFromPoint,
    )
    const ascendingDepthDocumentKeys = ReactPage.getDocumentKeysSortedByDepth(getState())
    const descendingDepthDocumentKeys = ascendingDepthDocumentKeys.slice().reverse()

    let currentElement: Element | null = elementFromPoint
    let keys = null

    while (currentElement != null) {
      for (const documentKey of descendingDepthDocumentKeys) {
        const byElementKey = elementImperativeHandles.get(documentKey)

        if (byElementKey == null) continue

        for (const [elementKey, elementImperativeHandle] of byElementKey) {
          if (elementImperativeHandle.getDomNode() === currentElement) {
            return { documentKey, elementKey }
          }
        }
      }

      currentElement = currentElement.parentElement
    }

    return keys
  }
}

function startPollingElementFromPoint(): ThunkAction<() => void, State, unknown, Action> {
  return (dispatch, getState) => {
    let lastElementFromPoint: Element | null = null
    let animationFrameRequestId = requestAnimationFrame(handleAnimationFrameRequest)

    return () => {
      cancelAnimationFrame(animationFrameRequestId)
    }

    function handleAnimationFrameRequest() {
      const pointer = getPointer(getState())
      const elementFromPoint =
        pointer == null ? null : document.elementFromPoint(pointer.x, pointer.y)

      if (elementFromPoint !== lastElementFromPoint) {
        lastElementFromPoint = elementFromPoint

        const keys = dispatch(elementKeysFromElementFromPoint(elementFromPoint))

        dispatch(Builder.elementFromPointChange(keys))
      }

      animationFrameRequestId = requestAnimationFrame(handleAnimationFrameRequest)
    }
  }
}

function registerBuilderComponents(): ThunkAction<() => void, State, unknown, Action> {
  return (dispatch, getState) => {
    const state = getState()
    const componentsMeta = getComponentsMeta(state)

    componentsMeta.forEach((meta, type) => {
      const descriptors = getComponentPropControllerDescriptors(state, type)
      if (descriptors != null) {
        const [serializedControls, transferables] = serializeControls(descriptors)
        dispatch(
          Builder.registerBuilderComponent({ type, meta, serializedControls }, transferables),
        )
      }
    })

    return () => {
      componentsMeta.forEach((_, type) => {
        dispatch(Builder.unregisterBuilderComponent({ type }))
      })
    }
  }
}

function registerBuilderDocuments(): ThunkAction<() => void, State, unknown, Action> {
  return (dispatch, getState) => {
    const documents = Documents.getDocuments(getDocumentsStateSlice(getState()))

    documents.forEach(document => {
      dispatch(Builder.registerBuilderDocument(document))
    })

    return () => {
      documents.forEach((_document, documentKey) => {
        dispatch(Builder.unregisterBuilderDocument(documentKey))
      })
    }
  }
}

export function initialize(
  builderProxy: BuilderAPIProxy,
): ThunkAction<() => void, State, unknown, Action> {
  return (dispatch, getState) => {
    const unregisterBuilderDocuments = dispatch(registerBuilderDocuments())
    const stopMeasuringElements = dispatch(startMeasuringElements())
    const stopMeasuringDocumentElement = dispatch(startMeasuringDocumentElement())
    const stopHandlingFocusEvent = dispatch(startHandlingFocusEvents())
    const unlockDocumentScroll = dispatch(lockDocumentScroll())
    const stopHandlingPointerMoveEvent = dispatch(startHandlingPointerMoveEvent())
    const stopPollingElementFromPoint = dispatch(startPollingElementFromPoint())
    const unregisterBuilderComponents = dispatch(registerBuilderComponents())

    const breakpoints = ReactPage.getBreakpoints(getState())
    dispatch(Shared.setBreakpoints(breakpoints))
    dispatch(Internal.setIsInBuilder(true))
    builderProxy.dispatchBuffered()

    return () => {
      unregisterBuilderDocuments()
      stopMeasuringElements()
      stopMeasuringDocumentElement()
      stopHandlingFocusEvent()
      unlockDocumentScroll()
      stopHandlingPointerMoveEvent()
      stopPollingElementFromPoint()
      unregisterBuilderComponents()
      dispatch(Internal.setIsInBuilder(false))
    }
  }
}

function measureBoxModelsMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case InternalActionTypes.REGISTER_COMPONENT_HANDLE: {
          if (BoxModels.isMeasurable(action.payload.componentHandle)) {
            dispatch(
              Internal.registerMeasurable(
                action.payload.documentKey,
                action.payload.elementKey,
                action.payload.componentHandle,
              ),
            )
          }

          break
        }

        case InternalActionTypes.UNREGISTER_COMPONENT_HANDLE:
          dispatch(
            Internal.unregisterMeasurable(action.payload.documentKey, action.payload.elementKey),
          )
          break
      }

      return next(action)
    }
  })
}

export function builderAPIMiddleware(
  builderProxy: BuilderAPIProxy,
): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch }) => next => {
    if (typeof window === 'undefined') return (action: Action) => next(action)

    let cleanUp = () => {}
    return (action: Action) => {
      switch (action.type) {
        case BuilderActionTypes.CHANGE_ELEMENT_BOX_MODELS:
        case BuilderActionTypes.MOUNT_COMPONENT:
        case BuilderActionTypes.UNMOUNT_COMPONENT:
        case BuilderActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE:
        case BuilderActionTypes.MESSAGE_BUILDER_PROP_CONTROLLER:
        case BuilderActionTypes.HANDLE_WHEEL:
        case BuilderActionTypes.HANDLE_POINTER_MOVE:
        case BuilderActionTypes.ELEMENT_FROM_POINT_CHANGE:
        case BuilderActionTypes.SET_LOCALE:
        case BuilderActionTypes.SET_BREAKPOINTS:
        case BuilderActionTypes.REGISTER_BUILDER_DOCUMENT:
        case BuilderActionTypes.UNREGISTER_BUILDER_DOCUMENT:
        case BuilderActionTypes.REGISTER_BUILDER_COMPONENT:
        case BuilderActionTypes.UNREGISTER_BUILDER_COMPONENT:
          builderProxy.execute(action)
          break

        case HostActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP:
          window.document.documentElement.scrollTop = action.payload.scrollTop
          break

        case HostActionTypes.SCROLL_DOCUMENT_ELEMENT:
          window.document.documentElement.scrollTop += action.payload.scrollTopDelta
          break

        case HostActionTypes.SET_BUILDER_EDIT_MODE:
          window.getSelection()?.removeAllRanges()
          break

        case HostActionTypes.INIT:
          // dispatched by the parent window after establishing the connection
          cleanUp = dispatch(initialize(builderProxy))
          break

        case HostActionTypes.CLEAN_UP:
          // dispatched by the parent window on disconnect
          cleanUp()
          break
      }

      return next(action)
    }
  })
}

function createAndRegisterPropControllers(
  documentKey: string,
  elementKey: string,
): ThunkAction<Record<string, ControlInstance> | null, State, unknown, Action> {
  return (dispatch, getState) => {
    const descriptors = ReactPage.getElementPropControllerDescriptors(
      getState(),
      documentKey,
      elementKey,
    )

    if (descriptors == null) return null

    const propControllers = Object.entries(descriptors).reduce(
      (acc, [propName, descriptor]) => {
        const propController = createPropController(descriptor, message =>
          dispatch(
            Builder.messageBuilderPropController(documentKey, elementKey, propName, message),
          ),
        ) as ControlInstance

        return { ...acc, [propName]: propController }
      },
      {} as Record<string, ControlInstance>,
    )

    dispatch(Internal.registerPropControllers(documentKey, elementKey, propControllers))

    return propControllers
  }
}

export function propControllerHandlesMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case InternalActionTypes.REGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey, componentHandle } = action.payload
          const element = ReactPage.getElement(getState(), documentKey, elementKey)
          const propControllers = dispatch(
            createAndRegisterPropControllers(documentKey, elementKey),
          )

          if (
            element != null &&
            !ReactPage.isElementReference(element) &&
            PropControllerHandles.isPropControllersHandle(componentHandle)
          ) {
            dispatch(
              Internal.registerPropControllersHandle(documentKey, elementKey, componentHandle),
            )
            componentHandle.setPropControllers(propControllers)
          }

          break
        }

        case InternalActionTypes.UNREGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey } = action.payload
          const handle = PropControllerHandles.getPropControllersHandle(
            getPropControllerHandlesStateSlice(getState()),
            documentKey,
            elementKey,
          )

          handle?.setPropControllers(null)

          dispatch(Internal.unregisterPropControllers(documentKey, elementKey))

          break
        }

        case HostActionTypes.MESSAGE_HOST_PROP_CONTROLLER: {
          const propController = PropControllerHandles.getPropController(
            getPropControllerHandlesStateSlice(getState()),
            action.payload.documentKey,
            action.payload.elementKey,
            action.payload.propName,
          )

          if (propController) propController.recv(action.payload.message)
        }
      }

      return next(action)
    }
  })
}

function makeswiftApiClientSyncMiddleware(
  client: MakeswiftHostApiClient,
): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(() => next => {
    return (action: Action) => {
      client.makeswiftApiClient.dispatch(action)

      return next(action)
    }
  })
}

function setupBuilderProxy(
  builderProxy: BuilderAPIProxy,
): ThunkAction<void, State, unknown, Action> {
  return dispatch => {
    builderProxy.setup({ onHostAction: action => dispatch(action) })
  }
}

export function configureStore({
  preloadedState,
  client,
  builderProxy,
}: {
  preloadedState: Partial<State>
  client: MakeswiftHostApiClient
  builderProxy: BuilderAPIProxy
}) {
  const initialState: Partial<State> = {
    ...preloadedState,
    isPreview: IsPreview.getInitialState(true),
  }

  const store = configureReduxStore({
    reducer,
    preloadedState: initialState,

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(
        ReactPage.elementTreeMiddleware(),
        measureBoxModelsMiddleware(),
        builderAPIMiddleware(builderProxy),
        propControllerHandlesMiddleware(),
        makeswiftApiClientSyncMiddleware(client),
      ),

    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(
        withSetupTeardown(
          () => {
            const dispatch = store.dispatch as Dispatch
            dispatch(setupBuilderProxy(builderProxy))
          },
          () => builderProxy.teardown(),
        ),
      ),

    devTools: devToolsConfig({
      name: `Host store (${new Date().toISOString()})`,
      actionsDenylist: [
        HostActionTypes.BUILDER_POINTER_MOVE,
        BuilderActionTypes.HANDLE_POINTER_MOVE,
        BuilderActionTypes.ELEMENT_FROM_POINT_CHANGE,
      ],
    }),
  })

  return store
}

export type Store = ReturnType<typeof configureStore>

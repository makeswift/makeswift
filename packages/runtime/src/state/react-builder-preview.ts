import {
  applyMiddleware,
  combineReducers,
  createStore,
  Dispatch as ReduxDispatch,
  Middleware,
  MiddlewareAPI,
  PreloadedState,
  Store as ReduxStore,
} from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import Router from 'next/router'

import deepEqual from '../utils/deepEqual'

import * as Documents from './modules/read-write-documents'
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
import * as ReactPage from './react-page'
import {
  Action,
  changeDocumentElementSize,
  changeElementBoxModels,
  messageBuilderPropController,
  registerBuilderComponent,
  registerMeasurable,
  registerPropControllers,
  registerPropControllersHandle,
  unregisterBuilderComponent,
  unregisterMeasurable,
  unregisterPropControllers,
  setIsInBuilder,
  handleWheel,
  handlePointerMove,
  elementFromPointChange,
  setBreakpoints,
} from './actions'
import { ActionTypes } from './actions'
import { createPropController } from '../prop-controllers/instances'
import { PropController } from '../prop-controllers/base'
import { serializeControls } from '../builder'
import { MakeswiftClient } from '../api/react'
import { ElementImperativeHandle } from '../runtimes/react/element-imperative-handle'

export type { Operation } from './modules/read-write-documents'
export type { BoxModelHandle } from './modules/box-models'
export { createBox, getBox, parse } from './modules/box-models'

export const reducer = combineReducers({
  documents: Documents.reducer,
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

    if (changedBoxModels.size > 0) dispatch(changeElementBoxModels(changedBoxModels))
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
      dispatch(handleWheel({ deltaX, deltaY }))
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
      dispatch(handlePointerMove({ clientX, clientY }))
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

        dispatch(changeDocumentElementSize(nextSize))
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
    const acendingDepthDocumentKeys = ReactPage.getDocumentKeysSortedByDepth(getState())
    const descendingDepthDocumentKeys = acendingDepthDocumentKeys.slice().reverse()

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

        dispatch(elementFromPointChange(keys))
      }

      animationFrameRequestId = requestAnimationFrame(handleAnimationFrameRequest)
    }
  }
}

export function initialize(): ThunkAction<() => void, State, unknown, Action> {
  return dispatch => {
    const stopMeasuringElements = dispatch(startMeasuringElements())
    const stopMeasuringDocumentElement = dispatch(startMeasuringDocumentElement())
    const stopHandlingFocusEvent = dispatch(startHandlingFocusEvents())
    const unlockDocumentScroll = dispatch(lockDocumentScroll())
    const stopHandlingPointerMoveEvent = dispatch(startHandlingPointerMoveEvent())
    const stopPollingElementFromPoint = dispatch(startPollingElementFromPoint())
    dispatch(setIsInBuilder(true))

    return () => {
      stopMeasuringElements()
      stopMeasuringDocumentElement()
      stopHandlingFocusEvent()
      unlockDocumentScroll()
      stopHandlingPointerMoveEvent()
      stopPollingElementFromPoint()
      dispatch(setIsInBuilder(false))
    }
  }
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

function measureBoxModelsMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return ({ dispatch }: MiddlewareAPI<Dispatch>) =>
    (next: ReduxDispatch<Action>) => {
      return (action: Action): Action => {
        switch (action.type) {
          case ActionTypes.REGISTER_COMPONENT_HANDLE: {
            if (BoxModels.isMeasurable(action.payload.componentHandle)) {
              dispatch(
                registerMeasurable(
                  action.payload.documentKey,
                  action.payload.elementKey,
                  action.payload.componentHandle,
                ),
              )
            }

            break
          }

          case ActionTypes.UNREGISTER_COMPONENT_HANDLE:
            dispatch(unregisterMeasurable(action.payload.documentKey, action.payload.elementKey))
            break
        }

        return next(action)
      }
    }
}

export function messageChannelMiddleware(
  client: MakeswiftClient,
): Middleware<Dispatch, State, Dispatch> {
  return ({ dispatch, getState }: MiddlewareAPI<Dispatch, State>) =>
    (next: ReduxDispatch<Action>) => {
      let cleanUp = () => {}

      if (typeof window === 'undefined') return cleanUp

      const messageChannel = new window.MessageChannel()

      window.parent.postMessage(messageChannel.port2, '*', [messageChannel.port2])

      messageChannel.port1.onmessage = (event: MessageEvent<Action>) => dispatch(event.data)

      const state = getState()
      const registeredComponentsMeta = getComponentsMeta(state)

      registeredComponentsMeta.forEach((componentMeta, componentType) => {
        const propControllerDescriptors = getComponentPropControllerDescriptors(
          state,
          componentType,
        )

        if (propControllerDescriptors != null) {
          const [serializedControls, transferables] = serializeControls(propControllerDescriptors)

          messageChannel.port1.postMessage(
            registerBuilderComponent(componentType, componentMeta, serializedControls),
            transferables,
          )
        }
      })

      const breakpoints = ReactPage.getBreakpoints(state)
      messageChannel.port1.postMessage(setBreakpoints(breakpoints))

      // const routerLocale = Router.locale
      // if (routerLocale != null) {
      //   messageChannel.port1.postMessage(setLocale(new Intl.Locale(routerLocale)))
      // }

      // Router.events.on('routeChangeStart', () => {
      //   messageChannel.port1.postMessage(changePathnameStart())
      // })

      // Router.events.on('routeChangeComplete', () => {
      //   messageChannel.port1.postMessage(changePathnameComplete())
      // })

      return (action: Action): Action => {
        switch (action.type) {
          case ActionTypes.CHANGE_ELEMENT_BOX_MODELS:
          case ActionTypes.MOUNT_COMPONENT:
          case ActionTypes.UNMOUNT_COMPONENT:
          case ActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE:
          case ActionTypes.MESSAGE_BUILDER_PROP_CONTROLLER:
          case ActionTypes.HANDLE_WHEEL:
          case ActionTypes.HANDLE_POINTER_MOVE:
          case ActionTypes.ELEMENT_FROM_POINT_CHANGE:
            messageChannel.port1.postMessage(action)
            break

          case ActionTypes.REGISTER_COMPONENT: {
            const { type, meta, propControllerDescriptors } = action.payload
            const [serializedControls, transferables] = serializeControls(propControllerDescriptors)

            messageChannel.port1.postMessage(
              registerBuilderComponent(type, meta, serializedControls),
              transferables,
            )
            break
          }

          case ActionTypes.UNREGISTER_COMPONENT:
            messageChannel.port1.postMessage(unregisterBuilderComponent(action.payload.type))
            break

          case ActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP:
            window.document.documentElement.scrollTop = action.payload.scrollTop
            break

          case ActionTypes.SCROLL_DOCUMENT_ELEMENT:
            window.document.documentElement.scrollTop += action.payload.scrollTopDelta
            break

          case ActionTypes.SET_BUILDER_EDIT_MODE:
            messageChannel.port1.postMessage(action)
            window.getSelection()?.removeAllRanges()
            break

          case ActionTypes.SET_LOCALE: {
            const { pathname: currentPathname, query } = Router
            const pathname = (action.payload.pathname ?? currentPathname).replace(/^\//, '/')

            Router.replace({ pathname, query }, undefined, { locale: action.payload.locale })
            break
          }

          case ActionTypes.CHANGE_PATHNAME: {
            const pathname = action.payload.pathname.replace(/^\//, '/')
            const currentPathname = Router.asPath.replace(/^\//, '/')

            if (pathname !== currentPathname) Router.push(pathname)
            break
          }

          case ActionTypes.SET_LOCALIZED_RESOURCE_ID: {
            client.setLocalizedResourceId(action.payload)
            break
          }

          case ActionTypes.INIT:
            cleanUp = dispatch(initialize())
            break

          case ActionTypes.CLEAN_UP:
            cleanUp()
            break
        }

        return next(action)
      }
    }
}

function createAndRegisterPropControllers(
  documentKey: string,
  elementKey: string,
): ThunkAction<Record<string, PropController> | null, State, unknown, Action> {
  return (dispatch, getState) => {
    const descriptors = ReactPage.getElementPropControllerDescriptors(
      getState(),
      documentKey,
      elementKey,
    )

    if (descriptors == null) return null

    const propControllers = Object.entries(descriptors).reduce((acc, [propName, descriptor]) => {
      const propController = createPropController(descriptor, message =>
        dispatch(messageBuilderPropController(documentKey, elementKey, propName, message)),
      ) as PropController

      return { ...acc, [propName]: propController }
    }, {} as Record<string, PropController>)

    dispatch(registerPropControllers(documentKey, elementKey, propControllers))

    return propControllers
  }
}

export function propControllerHandlesMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return ({ dispatch, getState }: MiddlewareAPI<Dispatch, State>) =>
    (next: ReduxDispatch<Action>) => {
      return (action: Action): Action => {
        switch (action.type) {
          case ActionTypes.REGISTER_COMPONENT_HANDLE: {
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
              dispatch(registerPropControllersHandle(documentKey, elementKey, componentHandle))
              componentHandle.setPropControllers(propControllers)
            }

            break
          }

          case ActionTypes.UNREGISTER_COMPONENT_HANDLE: {
            const { documentKey, elementKey } = action.payload
            const handle = PropControllerHandles.getPropControllersHandle(
              getPropControllerHandlesStateSlice(getState()),
              documentKey,
              elementKey,
            )

            handle?.setPropControllers(null)

            dispatch(unregisterPropControllers(documentKey, elementKey))

            break
          }

          case ActionTypes.MESSAGE_HOST_PROP_CONTROLLER: {
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
    }
}

function makeswiftApiClientSyncMiddleware(
  client: MakeswiftClient,
): Middleware<Dispatch, State, Dispatch> {
  return () => (next: ReduxDispatch<Action>) => {
    return (action: Action): Action => {
      client.makeswiftApiClient.dispatch(action)

      return next(action)
    }
  }
}

export type Store = ReduxStore<State, Action> & { dispatch: Dispatch }

export function configureStore({
  rootElements,
  preloadedState,
  client,
}: {
  rootElements?: Map<string, Documents.Element>
  preloadedState?: PreloadedState<State>
  client: MakeswiftClient
}): Store {
  const initialState: PreloadedState<State> = {
    ...preloadedState,
    documents: Documents.getInitialState({ rootElements }),
    isPreview: IsPreview.getInitialState(true),
  }

  return createStore(
    reducer,
    initialState,
    applyMiddleware(
      thunk,
      measureBoxModelsMiddleware(),
      messageChannelMiddleware(client),
      propControllerHandlesMiddleware(),
      makeswiftApiClientSyncMiddleware(client),
    ),
  )
}

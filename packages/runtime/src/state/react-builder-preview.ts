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
import deepEqual from '../utils/deepEqual'

import * as Documents from './modules/read-write-documents'
import * as ReactComponents from './modules/react-components'
import * as BoxModels from './modules/box-models'
import * as ComponentsMeta from './modules/components-meta'
import * as PropControllers from './modules/prop-controllers'
import {
  Action,
  changeDocumentElementSize,
  registerComponent,
  registerMeasurable,
  unregisterMeasurable,
} from './actions'
import { ActionTypes } from './actions'

export type { Operation } from './modules/read-write-documents'
export type { BoxModelHandle } from './modules/box-models'
export { createBox, getBox, parse } from './modules/box-models'

const reducer = combineReducers({
  documents: Documents.reducer,
  reactComponents: ReactComponents.reducer,
  boxModels: BoxModels.reducer,
  componentsMeta: ComponentsMeta.reducer,
  propControllers: PropControllers.reducer,
  isInBuilder: (state: boolean = true, _action: Action): boolean => state,
})

export type State = ReturnType<typeof reducer>

function getBoxModelsStateSlice(state: State): BoxModels.State {
  return state.boxModels
}

function getMeasurables(state: State): Map<string, BoxModels.Measurable> {
  return BoxModels.getMeasurables(getBoxModelsStateSlice(state))
}

function getBoxModels(state: State): Map<string, BoxModels.BoxModel> {
  return BoxModels.getBoxModels(getBoxModelsStateSlice(state))
}

function getBoxModel(state: State, elementKey: string): BoxModels.BoxModel | null {
  return BoxModels.getBoxModel(getBoxModelsStateSlice(state), elementKey)
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

function measureElements(): ThunkAction<void, State, unknown, Action> {
  return (dispatch, getState) => {
    const measurables = getMeasurables(getState())
    const currentBoxModels = getBoxModels(getState())
    const measuredBoxModels = new Map(
      Array.from(measurables.entries())
        .map(([elementKey, measurable]) => {
          const boxModel = BoxModels.measure(measurable)

          return boxModel ? ([elementKey, boxModel] as const) : null
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry != null),
    )
    const changedBoxModels = new Map<string, BoxModels.BoxModel | null>()

    currentBoxModels.forEach((_boxModel, elementKey) => {
      if (!measuredBoxModels.has(elementKey)) changedBoxModels.set(elementKey, null)
    })

    measuredBoxModels.forEach((measuredBoxModel, elementKey) => {
      const currentBoxModel = getBoxModel(getState(), elementKey)

      if (currentBoxModel == null || !deepEqual(currentBoxModel, measuredBoxModel)) {
        changedBoxModels.set(elementKey, measuredBoxModel)
      }
    })

    if (changedBoxModels.size > 0) {
      dispatch({
        type: ActionTypes.CHANGE_ELEMENT_BOX_MODELS,
        payload: { changedElementBoxModels: changedBoxModels },
      })
    }
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

export function initialize(): ThunkAction<() => void, State, unknown, Action> {
  return dispatch => {
    const stopMeasuringElements = dispatch(startMeasuringElements())
    const stopMeasuringDocumentElement = dispatch(startMeasuringDocumentElement())

    return () => {
      stopMeasuringElements()
      stopMeasuringDocumentElement()
    }
  }
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

function measureBoxModelsMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return ({ dispatch }: MiddlewareAPI<Dispatch>) => (next: ReduxDispatch<Action>) => {
    return (action: Action): Action => {
      switch (action.type) {
        case ActionTypes.CHANGE_COMPONENT_HANDLE: {
          if (BoxModels.isMeasurable(action.payload.componentHandle)) {
            dispatch(registerMeasurable(action.payload.elementKey, action.payload.componentHandle))
          } else {
            dispatch(unregisterMeasurable(action.payload.elementKey))
          }

          break
        }

        case ActionTypes.UNMOUNT_COMPONENT:
          dispatch(unregisterMeasurable(action.payload.elementKey))
          break
      }

      return next(action)
    }
  }
}

export function messageChannelMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return ({ dispatch, getState }: MiddlewareAPI<Dispatch, State>) => (
    next: ReduxDispatch<Action>,
  ) => {
    const messageChannel = new MessageChannel()

    window.parent.postMessage(messageChannel.port2, '*', [messageChannel.port2])

    messageChannel.port1.onmessage = (event: MessageEvent<Action>) => dispatch(event.data)

    const state = getState()
    const registeredComponentsMeta = getComponentsMeta(state)

    registeredComponentsMeta.forEach((componentMeta, componentType) => {
      const propControllerDescriptors = getComponentPropControllerDescriptors(state, componentType)

      if (propControllerDescriptors != null) {
        messageChannel.port1.postMessage(
          registerComponent(componentType, componentMeta, propControllerDescriptors),
        )
      }
    })

    return (action: Action): Action => {
      switch (action.type) {
        case ActionTypes.CHANGE_ELEMENT_BOX_MODELS:
        case ActionTypes.MOUNT_COMPONENT:
        case ActionTypes.UNMOUNT_COMPONENT:
        case ActionTypes.REGISTER_COMPONENT:
        case ActionTypes.UNREGISTER_COMPONENT:
        case ActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE:
          messageChannel.port1.postMessage(action)
          break

        case ActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP:
          window.document.documentElement.scrollTop = action.payload.scrollTop
          break
      }

      return next(action)
    }
  }
}

export type Store = ReduxStore<State, Action> & { dispatch: Dispatch }

export function configureStore({
  preloadedState,
}: { preloadedState?: PreloadedState<State> } = {}): Store {
  return createStore(
    reducer,
    preloadedState,
    applyMiddleware(thunk, measureBoxModelsMiddleware(), messageChannelMiddleware()),
  )
}

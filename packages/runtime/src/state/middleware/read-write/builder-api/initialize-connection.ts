import { type ThunkAction } from '@reduxjs/toolkit'

import deepEqual from '../../../../utils/deepEqual'

import * as BoxModels from '../../../modules/read-write/box-models'
import * as BuilderEditMode from '../../../modules/builder-edit-mode'

import { type Action } from '../../../actions'

import * as ReadOnly from '../../../actions/internal/read-only-actions'
import * as Builder from '../../../builder-api/actions'

import { serializeControls } from '../../../../builder'
import { type BuilderAPIProxy } from '../../../builder-api/proxy'

import * as ReadOnlyState from '../../../read-only-state'
import {
  type State,
  getDocuments,
  getMeasurables,
  getBoxModels,
  getBoxModel,
  getElementImperativeHandlesContainingElement,
  getPointer,
} from '../../../read-write-state'

import { type ElementSize, getElementSize } from './element-size'

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

function startMeasuringElements(): ThunkAction<() => void, State, unknown, Action> {
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
      if (
        ReadOnlyState.getBuilderEditMode(getState()) === BuilderEditMode.BuilderEditMode.INTERACT
      ) {
        return
      }

      if (!(event.target instanceof window.HTMLElement) || !event.target.isContentEditable) {
        window.parent.focus()
      }
    }

    function handleFocusOut(event: FocusEvent) {
      if (
        ReadOnlyState.getBuilderEditMode(getState()) === BuilderEditMode.BuilderEditMode.INTERACT
      ) {
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
    let lastSize: ElementSize

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
    const ascendingDepthDocumentKeys = ReadOnlyState.getDocumentKeysSortedByDepth(getState())
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
    const componentsMeta = ReadOnlyState.getComponentsMeta(state)

    componentsMeta.forEach((meta, type) => {
      const descriptors = ReadOnlyState.getComponentPropControllerDescriptors(state, type)
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
    const documents = getDocuments(getState())

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

export function initializeBuilderConnection(
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

    const breakpoints = ReadOnlyState.getBreakpoints(getState())
    dispatch(Builder.setBreakpoints(breakpoints))
    dispatch(ReadOnly.setIsInBuilder(true))
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
      dispatch(ReadOnly.setIsInBuilder(false))
    }
  }
}

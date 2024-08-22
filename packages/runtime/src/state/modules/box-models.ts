import { type BoxModel } from '@makeswift/controls'
import {
  createBox as createBoxWithoutScroll,
  CreateBoxArgs,
  getBox as getBoxWithoutScroll,
  withScroll,
} from 'css-box-model'

import { Action, ActionTypes } from '../actions'

export type { BoxModel }

export function parse(rawString: string): number {
  const value = Number(rawString.replace(/px$/, ''))

  return Number.isFinite(value) ? value : 0
}

export function createBox(boxArgs: CreateBoxArgs): BoxModel {
  return withScroll(createBoxWithoutScroll(boxArgs))
}

export function getBox(element: Element): BoxModel {
  return withScroll(getBoxWithoutScroll(element))
}

export interface BoxModelHandle {
  getBoxModel(): BoxModel | null
}

export type Measurable = Element | BoxModelHandle

export function isMeasurable(value: unknown): value is Measurable {
  if (value instanceof Element) return true

  if (
    typeof value === 'object' &&
    value !== null &&
    'getBoxModel' in value &&
    typeof (value as { getBoxModel: unknown }).getBoxModel === 'function'
  ) {
    return true
  }

  return false
}

export function measure(measurable: Measurable): BoxModel | null {
  if (measurable instanceof Element) return getBox(measurable)

  return measurable.getBoxModel()
}

export type State = {
  measurables: Map<string, Map<string, Measurable>>
  boxModels: Map<string, Map<string, BoxModel>>
}

export function getInitialState(): State {
  return { measurables: new Map(), boxModels: new Map() }
}

export function getMeasurables(state: State): Map<string, Map<string, Measurable>> {
  return state.measurables
}

export function getBoxModels(state: State): Map<string, Map<string, BoxModel>> {
  return state.boxModels
}

export function getBoxModel(
  state: State,
  documentKey: string,
  elementKey: string,
): BoxModel | null {
  return getBoxModels(state).get(documentKey)?.get(elementKey) ?? null
}

export function reducer(state: State = getInitialState(), action: Action) {
  switch (action.type) {
    case ActionTypes.REGISTER_MEASURABLE: {
      const { documentKey, elementKey, measurable } = action.payload

      return {
        ...state,
        measurables: new Map(state.measurables).set(
          documentKey,
          new Map(state.measurables.get(documentKey) ?? []).set(elementKey, measurable),
        ),
      }
    }

    case ActionTypes.UNREGISTER_MEASURABLE: {
      const { documentKey, elementKey } = action.payload
      const nextMeasurables = new Map(state.measurables.get(documentKey) ?? [])

      const deleted = nextMeasurables.delete(elementKey)

      return deleted
        ? { ...state, measurables: new Map(state.measurables).set(documentKey, nextMeasurables) }
        : state
    }

    case ActionTypes.CHANGE_ELEMENT_BOX_MODELS: {
      const { changedElementBoxModels } = action.payload

      if (changedElementBoxModels.size === 0) return state

      const nextBoxModels = new Map(state.boxModels)

      changedElementBoxModels.forEach((changedBoxModels, documentKey) => {
        const nextDocumentBoxModels = new Map(nextBoxModels.get(documentKey) ?? [])

        changedBoxModels.forEach((changedBoxModel, elementKey) => {
          if (changedBoxModel == null) nextDocumentBoxModels.delete(elementKey)
          else nextDocumentBoxModels.set(elementKey, changedBoxModel)
        })

        if (nextDocumentBoxModels.size > 0) nextBoxModels.set(documentKey, nextDocumentBoxModels)
        else nextBoxModels.delete(documentKey)
      })

      return { ...state, boxModels: nextBoxModels }
    }

    default:
      return state
  }
}

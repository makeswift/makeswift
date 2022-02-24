import {
  BoxModel,
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
  measurables: Map<string, Measurable>
  boxModels: Map<string, BoxModel>
}

export function getInitialState(): State {
  return { measurables: new Map(), boxModels: new Map() }
}

export function getMeasurables(state: State): Map<string, Measurable> {
  return state.measurables
}

export function getBoxModels(state: State): Map<string, BoxModel> {
  return state.boxModels
}

export function getBoxModel(state: State, elementKey: string): BoxModel | null {
  return getBoxModels(state).get(elementKey) ?? null
}

export function reducer(state: State = getInitialState(), action: Action) {
  switch (action.type) {
    case ActionTypes.REGISTER_MEASURABLE:
      return {
        ...state,
        measurables: new Map(getMeasurables(state)).set(
          action.payload.elementKey,
          action.payload.measurable,
        ),
      }

    case ActionTypes.UNREGISTER_MEASURABLE: {
      const nextMeasurables = new Map(getMeasurables(state))

      const deleted = nextMeasurables.delete(action.payload.elementKey)

      return deleted ? { ...state, measurables: nextMeasurables } : state
    }

    case ActionTypes.CHANGE_ELEMENT_BOX_MODELS: {
      const { changedElementBoxModels } = action.payload

      if (changedElementBoxModels.size === 0) return state

      const nextBoxModels = new Map(getBoxModels(state))

      changedElementBoxModels.forEach((boxModel, elementKey) => {
        if (boxModel == null) nextBoxModels.delete(elementKey)
        else nextBoxModels.set(elementKey, boxModel)
      })

      return { ...state, boxModels: nextBoxModels }
    }

    default:
      return state
  }
}

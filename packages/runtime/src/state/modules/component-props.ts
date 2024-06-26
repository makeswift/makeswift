import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { type Data } from './read-only-documents'
import { Action, ActionTypes } from '../actions'
import deepEqual from '../../utils/deepEqual'

export type PropContents = { propData: Data; resolvedValue: Data }
export type Props = Map<string, PropContents>
export type State = Map<string, Props>

export function getInitialState(): State {
  return new Map()
}

export function getComponentProps(state: State, elementKey: string): Props | null {
  return state.get(elementKey) ?? null
}

export function getResolvedComponentProps(
  state: State,
  elementKey: string,
): Map<string, Data> | null {
  const props = getComponentProps(state, elementKey)
  if (!props) return null
  const resolvedProps = new Map<string, Data>()
  for (const [propName, prop] of props) {
    resolvedProps.set(propName, prop.resolvedValue)
  }
  return resolvedProps
}

export function getResolvedComponentProp(
  state: State,
  elementKey: string,
  propName: string,
): Data | null {
  return getComponentProps(state, elementKey)?.get(propName)?.resolvedValue ?? null
}

export function getRawComponentProp(
  state: State,
  elementKey: string,
  propName: string,
): Data | null {
  return getComponentProps(state, elementKey)?.get(propName)?.propData ?? null
}

export function hasComponentProp(state: State, elementKey: string, propName: string): Boolean {
  return state.get(elementKey)?.has(propName) ?? false
}

export function hasStaleComponentPropResolvedValue(
  state: State,
  elementKey: string,
  propName: string,
  propValue: Data,
): Boolean {
  if (!hasComponentProp(state, elementKey, propName)) return true
  const prop = getRawComponentProp(state, elementKey, propName)
  return !deepEqual(prop, propValue)
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_COMPONENT_PROP: {
      const { payload } = action
      return new Map(state).set(
        payload.elementKey,
        new Map(new Map(state.get(payload.elementKey) ?? [])).set(payload.propName, {
          propData: payload.propValue,
          resolvedValue: payload.resolvedValue,
        }),
      )
    }

    // FIXME
    // case ActionTypes.DELETE_COMPONENT_PROPS: {

    default:
      return state
  }
}

// export function registerComponentEffect(
//   type: string,
//   meta: ComponentMeta,
//   propControllerDescriptors: Record<string, PropControllerDescriptor>,
// ): ThunkAction<() => void, unknown, unknown, Action> {
//   return dispatch => {
//     dispatch(registerComponent(type, meta, propControllerDescriptors))

//     return () => {
//       dispatch(unregisterComponent(type))
//     }
//   }
// }

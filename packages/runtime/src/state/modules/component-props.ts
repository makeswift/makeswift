import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { type Data } from './read-only-documents'
import { Action, ActionTypes } from '../actions'
import { ControlDefinition } from '../../controls'

export type Props = Map<string, Data>
export type State = Map<string, Props>

export function getInitialState(): State {
  return new Map()
}

export function getComponentProps(state: State, elementKey: string): Props | null {
  return state.get(elementKey) ?? null
}

export function getComponentProp(state: State, elementKey: string, propName: string): Data | null {
  return getComponentProps(state, elementKey)?.get(propName) ?? null
}

export function hasComponentProp(state: State, elementKey: string, propName: string): Boolean {
  return state.get(elementKey)?.has(propName) ?? false
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_COMPONENT_PROP: {
      const { payload } = action
      return new Map(state).set(
        payload.elementKey,
        new Map(new Map(state.get(payload.elementKey) ?? [])).set(
          payload.propName,
          payload.propValue,
        ),
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

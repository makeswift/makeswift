// import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { type Data } from './read-only-documents'
import { Action, ActionTypes } from '../actions'
import * as Documents from './read-only-documents'
import * as PropControllers from './prop-controllers'
import { traverseElementTreeProps } from '../react-page'
import { ResolvableValue, controlTraitsRegistry } from '@makeswift/controls'
// import { ControlDefinition } from '../../controls'

export type Props = Map<string, ControlledValue>
export type State = {
  props: Map<string, Map<string, Props>>
  documents: Documents.State
  propControllers: PropControllers.State
}

export function getInitialState(): State {
  return {
    props: new Map(),
    documents: Documents.getInitialState(),
    propControllers: PropControllers.getInitialState(),
  }
}

export function getComponentProps(state: State, elementKey: string): Props | null {
  return state.props.get(elementKey) ?? null
}

export function getComponentProp(state: State, elementKey: string, propName: string): Data | null {
  return getComponentProps(state, elementKey)?.get(propName)?.data ?? null
}

export function hasComponentProp(state: State, elementKey: string, propName: string): Boolean {
  return state.props.get(elementKey)?.has(propName) ?? false
}

export function reducer(state: State = getInitialState(), action: Action): State {
  const documents = Documents.getDocuments(state.documents)

  documents.forEach((document, documentKey) => {
    if (Documents.isElementReference(document.rootElement)) return

    for (const [elementKey, propName, propData] of traverseElementTreeProps(
      state.propControllers,
      document.rootElement,
    )) {
      const prevProp = state.props.get(documentKey)?.get(elementKey)?.get(propName)

      if (prevProp?.data === propData) continue

      const traits = controlTraitsRegistry.get()

      state.props.get(documentKey)?.get(elementKey)?.set(propName, traits?.resolveValue(propData))

      // get existing prop value from state
      // compare with new value
      // if the same referrentially, do nothing
    }
  })

  switch (action.type) {
    case ActionTypes.SET_COMPONENT_PROP: {
      const { payload } = action
      const currentProps = state.props

      const nextProps = new Map(currentProps).set(
        payload.elementKey,
        new Map(new Map(currentProps.get(payload.elementKey) ?? [])).set(
          payload.propName,
          payload.propValue,
        ),
      )

      return { ...state, props: nextProps }
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

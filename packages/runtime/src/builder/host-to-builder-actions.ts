import { isAction } from '@reduxjs/toolkit'

// in the past, we reused the same action type for registering components both internally
// and in the builder; they have been since split into two separate action types,
// REGISTER_COMPONENT and REGISTER_BUILDER_COMPONENT, but we still have to expose what
// are now internal actions to the builder for backward compatibility with the older runtimes
import {
  type RegisterComponentAction,
  type UnregisterComponentAction,
  ReadOnlyActionTypes,
} from '../state/actions/internal/read-only-actions'

import { type BuilderAction, BuilderActionTypes } from '../state/builder-api/actions'

export const HostToBuilderActionTypes = {
  ...BuilderActionTypes,
  REGISTER_COMPONENT: ReadOnlyActionTypes.REGISTER_COMPONENT,
  UNREGISTER_COMPONENT: ReadOnlyActionTypes.UNREGISTER_COMPONENT,
} as const

export type HostToBuilderAction =
  | BuilderAction
  | RegisterComponentAction
  | UnregisterComponentAction

export function isHostToBuilderAction(action: unknown): action is HostToBuilderAction {
  return isAction(action) && Object.hasOwn(HostToBuilderActionTypes, action.type)
}

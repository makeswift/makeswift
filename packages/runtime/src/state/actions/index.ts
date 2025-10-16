import { isAction } from '@reduxjs/toolkit'

import { type BuilderAction, BuilderActionTypes } from '../builder-api'
import { type HostAction, HostActionTypes } from '../host-api'

import { type InternalAction, InternalActionTypes } from './internal'

export { type UnknownAction } from '@reduxjs/toolkit'
export { type DocumentPayload } from '../shared-api'

export const ActionTypes = {
  ...HostActionTypes,
  ...BuilderActionTypes,
  ...InternalActionTypes,
} as const

export type Action = HostAction | BuilderAction | InternalAction

export function isKnownAction(action: unknown): action is Action {
  return isAction(action) && Object.hasOwn(ActionTypes, action.type)
}

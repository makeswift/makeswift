import { type ReadOnlyAction, ReadOnlyActionTypes } from './read-only-actions'
import { type ReadWriteAction, ReadWriteActionTypes } from './read-write-actions'

export const InternalActionTypes = {
  ...ReadOnlyActionTypes,
  ...ReadWriteActionTypes,
} as const

export type InternalAction = ReadOnlyAction | ReadWriteAction

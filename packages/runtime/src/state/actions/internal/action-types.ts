import { ReadOnlyActionTypes } from './read-only-action-types'
import { ReadWriteActionTypes } from './read-write-action-types'

export const InternalActionTypes = {
  ...ReadOnlyActionTypes,
  ...ReadWriteActionTypes,
} as const

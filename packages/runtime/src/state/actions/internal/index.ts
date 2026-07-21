import { type ReadOnlyAction } from './read-only-actions'
import { type ReadWriteAction } from './read-write-actions'

export type InternalAction = ReadOnlyAction | ReadWriteAction

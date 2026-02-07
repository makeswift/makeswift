import { type ThunkDispatch, type Reducer } from '@reduxjs/toolkit'

import { type State as ReadOnlyState } from './read-only-state'
import { type State as ReadWriteState } from './read-write-state'
import { type Action } from './actions'

export type State = ReadOnlyState | ReadWriteState
export type Dispatch = ThunkDispatch<State, unknown, Action>
export type ReadOnlyReducer = Reducer<ReadOnlyState>
export type ReadWriteDispatch = ThunkDispatch<ReadWriteState, unknown, Action>

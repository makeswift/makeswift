import type { ThunkDispatch } from '@reduxjs/toolkit'

import type * as ReadOnlyState from './read-only-state'
import type * as ReadWriteState from './read-write-state'

import type { Action } from './actions'

export type State = ReadOnlyState.State | ReadWriteState.State

export function isReadOnlyState(state: State): state is ReadOnlyState.State {
  return state.isReadOnly === true
}

export function isReadWriteState(state: State): state is ReadWriteState.State {
  return state.isReadOnly === false
}

export type Dispatch = ThunkDispatch<State, unknown, Action>
export type ReadWriteDispatch = ThunkDispatch<ReadWriteState.State, unknown, Action>

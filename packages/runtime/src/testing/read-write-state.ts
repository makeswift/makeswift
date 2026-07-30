import { type State, type ReadWriteState, isReadWriteState } from '../state/unified-state'

export function expectReadWriteState(state: State): asserts state is ReadWriteState {
  expect(isReadWriteState(state)).toBe(true)
}

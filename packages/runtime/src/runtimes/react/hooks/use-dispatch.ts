import { useStore } from './use-store'
import { type Dispatch as ReadOnlyDispatch } from '../../../state/read-only-state'
import { type Dispatch as ReadWriteDispatch } from '../../../state/read-write-state'

type Dispatch = ReadOnlyDispatch & ReadWriteDispatch

export function useDispatch(): Dispatch {
  const store = useStore()

  return store.dispatch
}

import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'

import { useStore } from './use-store'
import { type State as ReadOnlyState } from '../../../state/read-only-state'
import { type State as ReadWriteState } from '../../../state/read-write-state'

type State = ReadOnlyState | ReadWriteState

export function useSelector<R>(selector: (state: State) => R): R {
  const store = useStore()

  return useSyncExternalStoreWithSelector(store.subscribe, store.getState, store.getState, selector)
}

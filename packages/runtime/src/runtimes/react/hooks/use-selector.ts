import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'

import { type State } from '../../../state/unified-state'

import { useStore } from './use-store'

export function useSelector<R>(selector: (state: State) => R): R {
  const store = useStore()

  return useSyncExternalStoreWithSelector(store.subscribe, store.getState, store.getState, selector)
}

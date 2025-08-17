import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'

import { useStore } from './use-store'
import { State as ReactPageState } from '../../../state/react-page'
import { State as ReactBuilderPreviewState } from '../../../state/react-builder-preview'

type State = ReactPageState | ReactBuilderPreviewState

export function useSelector<R>(selector: (state: State) => R): R {
  const store = useStore()

  return useSyncExternalStoreWithSelector(store.subscribe, store.getState, store.getState, selector)
}

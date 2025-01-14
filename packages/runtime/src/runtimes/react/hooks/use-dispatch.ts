import { useStore } from './use-store'
import { Dispatch as ReactPageDispatch } from '../../../state/react-page'
import { Dispatch as ReactBuilderPreviewDispatch } from '../../../state/react-builder-preview'

type Dispatch = ReactPageDispatch & ReactBuilderPreviewDispatch

export function useDispatch(): Dispatch {
  const store = useStore()

  return store.dispatch
}

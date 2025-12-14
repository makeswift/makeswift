import { getIsPreview } from '../../../state/read-only-state'
import { useSelector } from './use-selector'

export function useIsPreview(): boolean {
  return useSelector(state => getIsPreview(state))
}

import { getIsReadOnly } from '../../../state/read-only-state'
import { useSelector } from './use-selector'

export function useIsReadOnly(): boolean {
  return useSelector(state => getIsReadOnly(state))
}

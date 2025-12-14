import { getIsInBuilder } from '../../../state/read-only-state'
import { useSelector } from './use-selector'

export function useIsInBuilder(): boolean {
  return useSelector(state => getIsInBuilder(state))
}

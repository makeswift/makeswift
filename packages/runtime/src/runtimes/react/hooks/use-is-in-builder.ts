import { getIsInBuilder } from '../../../state/read-only-state'
import { isServer } from '../../../utils/is-server'
import { useSelector } from './use-selector'

export function useIsInBuilder(): boolean {
  if (isServer()) return false
  return useSelector(state => getIsInBuilder(state))
}

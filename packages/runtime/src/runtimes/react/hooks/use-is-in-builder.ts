import { getIsInBuilder } from '../../../state/react-page'
import { useSelector } from './use-selector'

export function useIsInBuilder(): boolean {
  return useSelector(state => getIsInBuilder(state))
}

import { getIsPreview } from '../../../state/react-page'
import { useSelector } from './use-selector'

export function useIsPreview(): boolean {
  return useSelector(state => getIsPreview(state))
}

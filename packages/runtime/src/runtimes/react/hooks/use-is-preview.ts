import { getSiteVersion } from '../../../state/modules/site-version'
import { useSelector } from './use-selector'

export function useIsPreview(): boolean {
  return useSelector(state => getSiteVersion(state.siteVersion) != null)
}

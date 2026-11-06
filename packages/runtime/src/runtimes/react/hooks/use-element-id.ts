import { resolveElementId } from '../../../state/read-only-state'
import { useSelector } from './use-selector'

export function useElementId(elementKey: string | null | undefined): string | null {
  return useSelector(state =>
    elementKey == null ? null : resolveElementId({ state, documentKey: null, elementKey }),
  )
}

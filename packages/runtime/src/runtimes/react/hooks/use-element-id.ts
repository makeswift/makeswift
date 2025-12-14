import { getElementId } from '../../../state/read-only-state'
import { useDocumentKey } from './use-document-context'
import { useSelector } from './use-selector'

export function useElementId(elementKey: string | null | undefined): string | null {
  const documentKey = useDocumentKey()

  return useSelector(state =>
    documentKey == null || elementKey == null ? null : getElementId(state, documentKey, elementKey),
  )
}

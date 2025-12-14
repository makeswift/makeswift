import { Document, getDocument } from '../../../state/read-only-state'
import { useSelector } from './use-selector'

export function useDocument(documentKey: string): Document | null {
  return useSelector(state => getDocument(state, documentKey))
}

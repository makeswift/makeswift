import { Document, getDocument } from '../../../state/react-page'
import { useSelector } from './use-selector'

export function useDocument(documentKey: string): Document | null {
  return useSelector(state => getDocument(state, documentKey))
}

'use client'

import { type ElementData, getElement, isElementReference } from '../../../state/read-only-state'

import { useSelector } from './use-selector'
import { useDocumentKey } from './use-document-context'

export const useElementData = ({ elementKey }: { elementKey: string }): ElementData | null => {
  const documentKey = useDocumentKey()

  return useSelector(state => {
    if (documentKey == null) return null

    const element = getElement(state, documentKey, elementKey)
    return element && !isElementReference(element) ? element : null
  })
}

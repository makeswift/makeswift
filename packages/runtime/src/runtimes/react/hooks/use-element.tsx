'use client'

import { type Element, getElement } from '../../../state/read-only-state'

import { useSelector } from './use-selector'
import { useDocumentKey } from './use-document-context'

export const useElement = ({ elementKey }: { elementKey: string }): Element | null => {
  const documentKey = useDocumentKey()

  return useSelector(state => {
    if (documentKey == null) return null

    return getElement(state, documentKey, elementKey)
  })
}

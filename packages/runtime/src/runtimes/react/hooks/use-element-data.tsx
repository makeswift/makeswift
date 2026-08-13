'use client'

import { type ElementData, isElementReference } from '../../../state/read-only-state'

import { useElement } from './use-element'

export const useElementData = ({ elementKey }: { elementKey: string }): ElementData | null => {
  const element = useElement({ elementKey })
  return element && !isElementReference(element) ? element : null
}

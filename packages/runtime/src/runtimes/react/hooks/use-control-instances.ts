import { ControlInstance } from '@makeswift/controls'

import { getPropControllers } from '../../../state/read-only-state'
import { useDocumentKey } from './use-document-context'
import { useSelector } from './use-selector'

export function useControlInstances(elementKey: string): Record<string, ControlInstance> | null {
  const documentKey = useDocumentKey()

  return useSelector(state => {
    if (documentKey == null) return null

    return getPropControllers(state, { documentKey, elementKey })
  })
}

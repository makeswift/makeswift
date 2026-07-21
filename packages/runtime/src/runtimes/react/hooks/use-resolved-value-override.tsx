'use client'

import { createContext, useContext } from 'react'

import {
  type ResolvedValueKey,
  type ResolvedValue,
  hasResolvedValueOverride,
  getResolvedValueOverride,
} from '../../../state/read-write-state'

import { isReadWriteState } from '../../../state/unified-state'
import { useSelector } from './use-selector'
import { useDocumentKey } from './use-document-context'

export const DisableResolvedValueOverride = createContext<ResolvedValueKey | null>(null)

export function useDisableResolvedValueOverride(instanceKey: ResolvedValueKey): boolean {
  return useContext(DisableResolvedValueOverride) === instanceKey
}

export const useResolvedValueOverride = (
  instanceKey: ResolvedValueKey,
): [ResolvedValue, boolean] => {
  const documentKey = useDocumentKey()
  const disableOverride = useDisableResolvedValueOverride(instanceKey)

  return useSelector(state => {
    if (documentKey == null || !isReadWriteState(state)) return [undefined, false]

    return [
      getResolvedValueOverride(state, documentKey, instanceKey),
      !disableOverride && hasResolvedValueOverride(state, documentKey, instanceKey),
    ]
  })
}

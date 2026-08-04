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

export const DisableResolvedValueOverride = createContext<ResolvedValueKey | undefined>(undefined)

export function useIsResolvedValueOverrideDisabled(
  instanceKey: ResolvedValueKey | undefined,
): boolean {
  const disabledKey = useContext(DisableResolvedValueOverride)
  return (
    disabledKey?.elementKey === instanceKey?.elementKey &&
    disabledKey?.propPath === instanceKey?.propPath
  )
}

export const useResolvedValueOverride = (
  instanceKey: ResolvedValueKey | undefined,
): [ResolvedValue, boolean] => {
  const documentKey = useDocumentKey()
  const isDisabled = useIsResolvedValueOverrideDisabled(instanceKey)

  return useSelector(
    state => {
      if (documentKey == null || instanceKey == null || !isReadWriteState(state))
        return [undefined, false]

      return [
        getResolvedValueOverride(state, documentKey, instanceKey),
        !isDisabled && hasResolvedValueOverride(state, documentKey, instanceKey),
      ]
    },
    (a, b) => a[0] === b[0] && a[1] === b[1],
  )
}

import { useRef } from 'react'

import { ControlDefinition } from '@makeswift/controls'

import { partitionRecord } from '../../../utils/partition'

import { getComponentPropControllerDescriptors } from '../../../state/read-only-state'
import { type LegacyDescriptor, isLegacyDescriptor } from '../../../prop-controllers/descriptors'

import { useStore } from './use-store'

export function useControlDefs({
  elementType,
}: {
  elementType: string
}): readonly [Record<string, LegacyDescriptor>, Record<string, ControlDefinition>] {
  const store = useStore()
  const all = getComponentPropControllerDescriptors(store.getState(), elementType) ?? {}
  return useRef(partitionRecord(all, isLegacyDescriptor)).current
}

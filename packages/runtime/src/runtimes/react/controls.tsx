import { useRef, ReactNode } from 'react'

import { ControlDefinition } from '@makeswift/controls'

import { partitionRecord } from '../../utils/partition'

import * as State from '../../state/read-only-state'
import { isLegacyDescriptor, LegacyDescriptor } from '../../prop-controllers/descriptors'

import { useStore } from './hooks/use-store'

import { resolveLegacyDescriptorProp } from './legacy-controls'
import { useResolvedProps } from './hooks/use-resolved-props'

type PropsValueProps = {
  element: State.ElementData
  children(props: Record<string, unknown>): ReactNode
}

function useControlDefs(
  elementType: string,
): readonly [Record<string, LegacyDescriptor>, Record<string, ControlDefinition>] {
  const store = useStore()
  const all = State.getComponentPropControllerDescriptors(store.getState(), elementType) ?? {}
  return useRef(partitionRecord(all, isLegacyDescriptor)).current
}

export function ResolveProps({ element, children: renderComponent }: PropsValueProps): ReactNode {
  const [legacyDescriptors, definitions] = useControlDefs(element.type)

  const resolvedProps = useResolvedProps(definitions, element.props, element.key)

  const renderFn = Object.entries(legacyDescriptors).reduceRight(
    (renderFn, [propName, descriptor]) =>
      props =>
        resolveLegacyDescriptorProp(descriptor, propName, element.props[propName], props, renderFn),
    renderComponent,
  )

  return renderFn(resolvedProps)
}

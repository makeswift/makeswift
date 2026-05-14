import { useRef, ReactNode, memo, useMemo } from 'react'

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

export function useControlDefs(
  elementType: string,
): readonly [Record<string, LegacyDescriptor>, Record<string, ControlDefinition>] {
  const store = useStore()
  const all = State.getComponentPropControllerDescriptors(store.getState(), elementType) ?? {}
  return useRef(partitionRecord(all, isLegacyDescriptor)).current
}

export function ResolveProps({ element, children: renderComponent }: PropsValueProps): ReactNode {
  const [legacyDescriptors, definitions] = useControlDefs(element.type)

  const { props: resolvedProps, emitted } = useResolvedProps(definitions, element.props, element.key)

  emitted.styles.usePollStyledElementBoxModels()

  /*
    Note to self: when legacyDescriptors is empty (as is the case for my test components that only use
    Style v1), the result of the block below is that renderFn === renderComponent. This is why I'm
    seeing stability even without memoizing `renderFn` (so long as `renderComponent` is stable, which
    I've done via a useCallback in ElementData, and so long as we use the memoized wrapper around `renderFn`)

  */
  const renderFn = Object.entries(legacyDescriptors).reduceRight(
    (renderFn, [propName, descriptor]) =>
      props =>
        resolveLegacyDescriptorProp(descriptor, propName, element.props[propName], props, renderFn),
    renderComponent,
  )

  /*
    TODO potentially fix this up

    see note above renderFn
  */
  // const renderFn = useMemo(
  //   () =>
  //     Object.entries(legacyDescriptors).reduceRight(
  //       (renderFn, [propName, descriptor]) =>
  //         (props: Record<string, unknown>) =>
  //           resolveLegacyDescriptorProp(descriptor, propName, element.props[propName], props, renderFn),
  //       renderComponent,
  //     ),
  //   [legacyDescriptors, renderComponent, ...Object.keys(legacyDescriptors).map(k => element.props[k])],
  // )

  return (
    <>
      <MemoizedConsumer renderFn={renderFn} resolvedProps={resolvedProps} />
      {emitted.styles.renderStyles()}
    </>
  )
}

const MemoizedConsumer = memo(function MemoizedConsumer({
  renderFn,
  resolvedProps,
}: {
  renderFn: (props: Record<string, unknown>) => ReactNode
  resolvedProps: Record<string, unknown>
}) {
  console.log('MemoizedConsumer rendered')
  return renderFn(resolvedProps)
})

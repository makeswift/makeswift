'use client'

import { type ReactNode, memo } from 'react'

import { type ElementData } from '../../../state/read-only-state'

import { useControlDefs } from '../hooks/use-control-defs'
import { useResolvedProps } from '../hooks/use-resolved-props'
import { useControlInstances } from '../hooks/use-control-instances'

import { resolveLegacyDescriptorProp } from '../legacy-controls'
import { useControlledStyles } from '../css-runtime/hooks/use-controlled-styles'

export function ResolveProps({
  element,
  children: renderComponent,
}: {
  element: ElementData
  children: (props: Record<string, unknown>) => ReactNode
}): ReactNode {
  const [legacyDescriptors, definitions] = useControlDefs({ elementType: element.type })

  const elementKey = element.key
  const { getStylesheet, styleElements } = useControlledStyles({ namespace: elementKey })
  const controlInstances = useControlInstances(elementKey)
  const resolvedProps = useResolvedProps({
    elementKey,
    propDefs: definitions,
    propData: element.props,
    controlInstances,
    getStylesheet,
  })

  const renderFn = Object.entries(legacyDescriptors).reduceRight(
    (renderFn, [propName, descriptor]) =>
      props =>
        resolveLegacyDescriptorProp(
          descriptor,
          propName,
          element.key,
          element.props[propName],
          props,
          renderFn,
        ),
    renderComponent,
  )

  return (
    <>
      <MemoizedComponent renderFn={renderFn} resolvedProps={resolvedProps} />
      {styleElements}
    </>
  )
}

/**
 * This level of memoization exists so that changes to element data do not lead to re-rendering
 * a component unless they actually result in changes to that component's resolved prop values.
 */
const MemoizedComponent = memo(function MemoizedComponent({
  renderFn,
  resolvedProps,
}: {
  renderFn: (props: Record<string, unknown>) => ReactNode
  resolvedProps: Record<string, unknown>
}) {
  return renderFn(resolvedProps)
})

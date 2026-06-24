import { type ReactNode } from 'react'

import { type ElementData } from '../../../state/read-only-state'

import { useControlDefs } from '../hooks/use-control-defs'
import { useResolvedProps } from '../hooks/use-resolved-props'

import { resolveLegacyDescriptorProp } from '../legacy-controls'

export function ResolveProps({
  element,
  children: renderComponent,
}: {
  element: ElementData
  children: (props: Record<string, unknown>) => ReactNode
}): ReactNode {
  const [legacyDescriptors, definitions] = useControlDefs({ elementType: element.type })

  const resolvedProps = useResolvedProps(definitions, element.props, element.key)

  const renderFn = Object.entries(legacyDescriptors).reduceRight(
    (renderFn, [propName, descriptor]) =>
      props =>
        resolveLegacyDescriptorProp(descriptor, propName, element.props[propName], props, renderFn),
    renderComponent,
  )

  return renderFn(resolvedProps)
}

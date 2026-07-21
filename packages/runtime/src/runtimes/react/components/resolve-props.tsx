import { type ReactNode } from 'react'

import { type ElementData } from '../../../state/read-only-state'

import { useControlDefs } from '../hooks/use-control-defs'
import { useResolvedProps } from '../hooks/use-resolved-props'
import { useControlInstances } from '../hooks/use-control-instances'
import { useStylesheetFactory } from '../hooks/use-stylesheet-factory'

import { resolveLegacyDescriptorProp } from '../legacy-controls'

export function ResolveProps({
  element,
  children: renderComponent,
}: {
  element: ElementData
  children: (props: Record<string, unknown>) => ReactNode
}): ReactNode {
  const [legacyDescriptors, definitions] = useControlDefs({ elementType: element.type })

  const stylesheetFactory = useStylesheetFactory()
  const controlInstances = useControlInstances()
  const resolvedProps = useResolvedProps({
    propDefs: definitions,
    propData: element.props,
    controlInstances,
    stylesheetFactory,
  })

  const renderFn = Object.entries(legacyDescriptors).reduceRight(
    (renderFn, [propName, descriptor]) =>
      props =>
        resolveLegacyDescriptorProp(descriptor, propName, element.props[propName], props, renderFn),
    renderComponent,
  )

  return renderFn(resolvedProps)
}

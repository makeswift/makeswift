import { ElementData, StyleDefinition } from '@makeswift/controls'
import { getRuntime } from './runtime'
import { getBreakpoints } from '../../../state/react-page'
import { createCollectingServerStylesheet } from '../css/server-css'
import { isLegacyDescriptor } from '../../../prop-controllers/descriptors'
import { DescriptorsByProp } from '../../../state/modules/prop-controllers'
import { mockResourceResolver } from './resource-resolver'

export function resolveProps(
  props: ElementData['props'],
  propDescriptors: DescriptorsByProp,
  elementKey: string,
): Record<string, unknown> {
  const runtime = getRuntime()
  const state = runtime.store.getState()
  const breakpoints = getBreakpoints(state)
  const stylesheet = createCollectingServerStylesheet(breakpoints, elementKey)
  const resolvedProps: Record<string, unknown> = {}

  Object.entries(propDescriptors).forEach(([propName, descriptor]) => {
    if (isLegacyDescriptor(descriptor)) {
      console.warn(`[resolveProps] Cannot use legacy descriptor in RSC. Prop: ${propName}`)
      return
    }

    const propData = props[propName]
    const isStyleControl = descriptor.controlType === StyleDefinition.type

    // Always process style controls, even when they have no data
    if (propData !== undefined || isStyleControl) {
      const resolvedValue = descriptor.resolveValue(
        propData,
        mockResourceResolver,
        stylesheet.child(propName),
      )
      const result = resolvedValue.readStable()
      resolvedProps[propName] = result
    }
  })

  return resolvedProps
}

import { ElementData } from '@makeswift/controls'
import { getRuntime } from '../context/server'
import { getBreakpoints } from '../../state/react-page'
import { createServerStylesheet } from './server-stylesheet'
import { isLegacyDescriptor } from '../../prop-controllers/descriptors'
import { DescriptorsByProp } from '../../state/modules/prop-controllers'
import { mockResourceResolver } from './resource-resolver'

export function resolveProps(
  props: ElementData['props'],
  propDescriptors: DescriptorsByProp,
  elementKey: string,
): Record<string, unknown> {
  const runtime = getRuntime()
  const state = runtime.store.getState()
  const breakpoints = getBreakpoints(state)

  const stylesheet = createServerStylesheet(breakpoints, elementKey)

  const resolvedProps: Record<string, unknown> = {}

  // Process each prop
  Object.entries(props).forEach(([propName, propData]) => {
    const descriptor = propDescriptors[propName]

    if (!descriptor) {
      console.warn(`[RSC] No descriptor found for prop: ${propName}`)
      return
    }

    if (isLegacyDescriptor(descriptor)) {
      console.log(`[RSC] Skipping legacy descriptor for prop: ${propName}`)
      return
    }

    console.log(`[RSC] Resolving unified control: ${propName}`)

    const resolvedValue = descriptor.resolveValue(
      propData,
      mockResourceResolver,
      stylesheet.child(propName),
    )
    resolvedProps[propName] = resolvedValue.readStable()

    console.log(`[RSC] Resolved ${propName}:`, resolvedProps[propName])
  })

  return resolvedProps
}

import { ElementData, StyleDefinition } from '@makeswift/controls'
import {
  getDocumentFromCache,
  getMakeswiftClient,
  getRuntime,
  getSiteVersionFromCache,
} from './runtime'
import { getBreakpoints } from '../../../state/react-page'
import { createCollectingServerStylesheet } from '../css/server-css'
import { isLegacyDescriptor } from '../../../prop-controllers/descriptors'
import { DescriptorsByProp } from '../../../state/modules/prop-controllers'
import { serverResourceResolver } from './resource-resolver'

export async function resolveProps(
  element: ElementData,
  propDescriptors: DescriptorsByProp,
): Promise<Record<string, unknown>> {
  const runtime = getRuntime()
  const siteVersion = getSiteVersionFromCache()
  const document = getDocumentFromCache()
  const client = getMakeswiftClient()

  const state = runtime.store.getState()
  const breakpoints = getBreakpoints(state)
  const stylesheet = createCollectingServerStylesheet(breakpoints, element.key)

  const serverResolver = serverResourceResolver(runtime, client, siteVersion, document)

  const resolvedProps = await Promise.all(
    Array.from(Object.entries(propDescriptors)).map(async ([propName, descriptor]) => {
      if (isLegacyDescriptor(descriptor)) {
        console.warn(`[resolveProps] Cannot use legacy descriptor in RSC. Prop: ${propName}`)
        return [propName, undefined] as const
      }

      const propData = element.props[propName]
      const isStyleControl = descriptor.controlType === StyleDefinition.type

      // Always process style controls, even when they have no data
      if (propData !== undefined || isStyleControl) {
        const resolvedValue = descriptor.resolveValue(
          propData,
          serverResolver,
          stylesheet.child(propName),
        )
        // TODO: This is a hack for style controls to have their styles injected
        // on the server. CSS injection on the server appears to have broken
        // when introducing the await resolvedValue.triggerResolve() ahead of
        // the `readStable` call — for proof, comment out the triggerResolve and
        // observe that styles are correct on load.
        resolvedValue.readStable()
        await resolvedValue.triggerResolve()
        const result = resolvedValue.readStable()
        return [propName, result] as const
      }

      return [propName, undefined] as const
    }),
  )

  const resolvedPropsRecord: Record<string, unknown> = Object.fromEntries(resolvedProps)
  return resolvedPropsRecord
}

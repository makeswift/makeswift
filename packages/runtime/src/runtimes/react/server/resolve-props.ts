import { type ElementData, ControlDefinition, mapValues, Stylesheet } from '@makeswift/controls'

import { type ServerRenderContext } from './render-context'
import { serverResourceResolver } from './resource-resolver'

import { propErrorHandlingProxy } from '../utils/prop-error-handling-proxy'

/**
 * Server-side counterpart of the `useResolvedProps` hook.
 */
export async function resolveProps(
  context: ServerRenderContext,
  element: ElementData,
  documentKey: string,
  propDefs: Record<string, ControlDefinition>,
  stylesheet: Stylesheet,
): Promise<Record<string, unknown>> {
  const resourceResolver = serverResourceResolver({ ...context, documentKey })

  const resolveProp = (def: ControlDefinition, propName: string) => {
    const data = element.props[propName]

    // Create a "placeholder" control instance so that controls that resolve to
    // React nodes can use `instanceKey` to reconstruct themselves on the client
    // (see `react/controls/slot/render-slot.tsx`).
    const control = def.createInstance({
      // these are top-level controls, so passing `propName` for `propPath` is appropriate
      instanceKey: { elementKey: element.key, propPath: propName },
      sendMessage: () => {},
    })

    return def.resolveValue(data, resourceResolver, stylesheet.child(propName), control)
  }

  const resolvables = mapValues(propDefs, (def, propName) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultValue = (def.config as any)?.defaultValue
    return propErrorHandlingProxy(resolveProp(def, propName), defaultValue, error => {
      console.warn(
        `Error reading value for prop "${propName}", falling back to \`${defaultValue}\`.`,
        { control: def, error },
      )
    })
  })

  // wait for side-effects (resource fetching, updating list child controls)
  await Promise.all(Object.entries(resolvables).map(([_, sub]) => sub.triggerResolve()))

  return Object.entries(resolvables).reduce<Record<string, unknown>>(
    (result, [propName, subscription]) => ({ ...result, [propName]: subscription.readStable() }),
    {},
  )
}

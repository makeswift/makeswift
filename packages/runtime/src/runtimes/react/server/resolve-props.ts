import { type ElementData } from '@makeswift/controls'

import { getBreakpoints } from '../../../state/read-only-state'

import { type ServerRenderContext, getStore } from './render-context'
import { serverResourceResolver } from './resource-resolver'
import { createCollectingServerStylesheet } from './css/server-css'

import {
  ControlDefinition,
  ControlInstance,
  mapValues,
  type Data,
  type Resolvable,
} from '@makeswift/controls'

import { propErrorHandlingProxy } from '../utils/prop-error-handling-proxy'

type CacheItem = {
  data: Data
  control: ControlInstance | undefined
  resolvedValue: Resolvable<unknown>
}

export async function resolveProps(
  context: ServerRenderContext,
  element: ElementData,
  propDefs: Record<string, ControlDefinition>,
): Promise<Record<string, unknown>> {
  const state = getStore(context).getState()

  const stylesheet = createCollectingServerStylesheet(
    context.cssCollector,
    getBreakpoints(state),
    element.key,
  )

  const resourceResolver = serverResourceResolver(context)
  const propData = element.props
  const controls: Record<string, ControlInstance> | null = null
  const cache: Record<string, CacheItem> = {}

  const resolveProp = (def: ControlDefinition, propName: string) => {
    const data = propData[propName]
    const control = controls?.[propName]

    if (
      cache[propName] != null &&
      data === cache[propName].data &&
      control === cache[propName].control
    ) {
      return cache[propName].resolvedValue
    }

    console.log('@@ resolving prop', propName)
    const resolvedValue = def.resolveValue(
      data,
      resourceResolver,
      stylesheet.child(propName),
      control,
    )

    cache[propName] = { data, control, resolvedValue }
    return resolvedValue
  }

  const resolvables = mapValues(propDefs, (def, propName) => {
    const defaultValue = (def.config as any)?.defaultValue
    return propErrorHandlingProxy(resolveProp(def, propName), defaultValue, error => {
      console.warn(
        `Error reading value for prop "${propName}", falling back to \`${defaultValue}\`.`,
        { control: def, error },
      )
    })
  })

  await Promise.all(Object.entries(resolvables).map(([_, sub]) => sub.triggerResolve()))

  // the order is important here, the styles are defined in the process of the props resolution,
  // calling `useDefinedStyles` before the props are resolved would effectively be a noop
  const resolvedProps = Object.entries(resolvables).reduce<Record<string, unknown>>(
    (result, [propName, subscription]) => ({ ...result, [propName]: subscription.readStable() }),
    {},
  )

  // stylesheetFactory.useDefinedStyles()
  console.log(
    '@@ resolvedProps',
    JSON.stringify(
      { propData, cache: Object.keys(cache), propDefs: Object.keys(propDefs), resolvedProps },
      null,
      2,
    ),
  )
  return resolvedProps
}

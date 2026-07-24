import { useMemo, useEffect, useRef, useSyncExternalStore, useCallback } from 'react'
import {
  ControlDefinition,
  ControlInstance,
  mapValues,
  type Data,
  type Resolvable,
} from '@makeswift/controls'

import { useResourceResolver } from './use-resource-resolver'

import { propErrorHandlingProxy } from '../utils/prop-error-handling-proxy'
import { useBreakpoints } from './use-breakpoints'

import { useResolvableRecord } from './use-resolvable-record'
import { GetStylesheet } from '../css-runtime/types'

type CacheItem = {
  data: Data
  control: ControlInstance | undefined
  resolvedValue: Resolvable<unknown>
}

export function useResolvedProps({
  elementKey,
  propDefs,
  propData,
  controlInstances,
  getStylesheet,
}: {
  elementKey: string
  propDefs: Record<string, ControlDefinition>
  propData: Record<string, Data>
  controlInstances: Record<string, ControlInstance> | null
  getStylesheet: GetStylesheet
}): Record<string, unknown> {
  const breakpoints = useBreakpoints()
  const resourceResolver = useResourceResolver()

  const cache = useRef<Record<string, CacheItem>>({}).current
  const resolveProp = useCallback(
    (def: ControlDefinition, propName: string) => {
      const data = propData[propName]
      const control = controlInstances?.[propName]

      if (
        cache[propName] != null &&
        data === cache[propName].data &&
        control === cache[propName].control
      ) {
        return cache[propName].resolvedValue
      }

      const stylesheet = getStylesheet({
        breakpointsData: breakpoints,
        elementKey,
        propPathComponents: [propName]
      })

      const resolvedValue = def.resolveValue(
        data,
        resourceResolver,
        stylesheet,
        control,
      )

      cache[propName] = { data, control, resolvedValue }
      return resolvedValue
    },
    [propData, cache, resourceResolver, controlInstances, breakpoints, elementKey, getStylesheet],
  )

  const resolvables = useMemo<Record<string, Resolvable<unknown>>>(
    () =>
      mapValues(propDefs, (def, propName) => {
        const defaultValue = (def.config as any)?.defaultValue
        return propErrorHandlingProxy(resolveProp(def, propName), defaultValue, error => {
          console.warn(
            `Error reading value for prop "${propName}" of element ${elementKey}, falling back to \`${defaultValue}\`.`,
            { control: def, error },
          )
        })
      }),
    [propDefs, resolveProp, elementKey],
  )

  const props = useResolvableRecord(resolvables)

  // no need to call `triggerResolve` on the server, all the resources should already be in
  // the host API client's cache (populated from the snapshot's cache)
  useEffect(() => {
    props.triggerResolve().catch(err => {
      console.log(`Error while resolving props for element ${elementKey}`, err)
    })
  }, [props, elementKey])

  const resolvedProps = useSyncExternalStore(props.subscribe, props.readStable, props.readStable)

  return resolvedProps
}

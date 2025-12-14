import { useMemo, useEffect, useRef, useSyncExternalStore, useCallback } from 'react'
import {
  ControlDefinition,
  ControlInstance,
  mapValues,
  type Data,
  type Resolvable,
} from '@makeswift/controls'

import * as ReactPage from '../../../state/read-only-state'
import { useResourceResolver } from './use-resource-resolver'
import { useDocumentKey } from './use-document-context'
import { useSelector } from './use-selector'

import { useStylesheetFactory } from './use-stylesheet-factory'

import { useResolvableRecord } from './use-resolvable-record'
import { propErrorHandlingProxy } from '../utils/prop-error-handling-proxy'

function useControlInstances(elementKey: string): Record<string, ControlInstance> | null {
  const documentKey = useDocumentKey()

  return useSelector(state => {
    if (documentKey == null) return null

    return ReactPage.getPropControllers(state, { documentKey, elementKey })
  })
}

type CacheItem = {
  data: Data
  control: ControlInstance | undefined
  resolvedValue: Resolvable<unknown>
}

export function useResolvedProps(
  propDefs: Record<string, ControlDefinition>,
  elementData: Record<string, Data>,
  elementKey: string,
): Record<string, unknown> {
  const stylesheetFactory = useStylesheetFactory()
  const resourceResolver = useResourceResolver()
  const controls = useControlInstances(elementKey)

  const cache = useRef<Record<string, CacheItem>>({}).current
  const resolveProp = useCallback(
    (def: ControlDefinition, propName: string) => {
      const data = elementData[propName]
      const control = controls?.[propName]

      if (
        cache[propName] != null &&
        data === cache[propName].data &&
        control === cache[propName].control
      ) {
        return cache[propName].resolvedValue
      }

      const resolvedValue = def.resolveValue(
        data,
        resourceResolver,
        stylesheetFactory.get(propName),
        control,
      )

      cache[propName] = { data, control, resolvedValue }
      return resolvedValue
    },
    [controls, elementData, resourceResolver, stylesheetFactory],
  )

  const resolvables = useMemo<Record<string, Resolvable<unknown>>>(
    () =>
      mapValues(propDefs, (def, propName) => {
        const defaultValue = (def.config as any)?.defaultValue
        return propErrorHandlingProxy(resolveProp(def, propName), defaultValue, error => {
          console.warn(
            `Error reading value for prop "${propName}", falling back to \`${defaultValue}\`.`,
            { control: def, error },
          )
        })
      }),
    [propDefs, resolveProp],
  )

  const props = useResolvableRecord(resolvables)

  // no need to call `triggerResolve` on the server, all the resources should already be in
  // the host API client's cache (populated from the snapshot's cache)
  useEffect(() => {
    props.triggerResolve()
  }, [props])

  // the order is important here, the styles are defined in the process of the props resolution,
  // calling `useDefinedStyles` before the props are resolved would effectively be a noop
  const resolvedProps = useSyncExternalStore(props.subscribe, props.readStable, props.readStable)

  stylesheetFactory.useDefinedStyles()

  return resolvedProps
}

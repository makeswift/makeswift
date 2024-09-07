import { useMemo, useEffect, useRef, useSyncExternalStore, useCallback } from 'react'
import {
  ControlDefinition,
  ControlInstance,
  mapValues,
  type Data,
  type Resolvable,
} from '@makeswift/controls'

import * as ReactPage from '../../../state/react-page'
import { useResourceResolver } from './use-resource-resolver'
import { useDocumentKey } from './use-document-key'
import { useSelector } from './use-selector'

import { useStylesheetFactory } from './use-stylesheet-factory'

import { resolvableRecord } from '../resolvable-record'

function useControlInstances(elementKey: string): Record<string, ControlInstance> | null {
  const documentKey = useDocumentKey()

  return useSelector(state => {
    if (documentKey == null) return null

    return ReactPage.getPropControllers(state, documentKey, elementKey)
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

  const resolvables = useMemo(() => mapValues(propDefs, resolveProp), [propDefs, resolveProp])
  const props = useMemo(() => resolvableRecord(resolvables), [resolvables])

  stylesheetFactory.useDefinedStyles()

  useEffect(() => {
    props.triggerResolve()
  }, [])

  return useSyncExternalStore(props.subscribe, props.readStable, props.readStable)
}

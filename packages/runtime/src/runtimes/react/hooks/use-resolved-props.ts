import { useMemo, useEffect, useRef, useSyncExternalStore } from 'react'
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

import { resolveableRecord } from '../resolvable-record'

function useControlInstances(elementKey: string): Record<string, ControlInstance> | null {
  const documentKey = useDocumentKey()

  return useSelector(state => {
    if (documentKey == null) return null

    return ReactPage.getPropControllers(state, documentKey, elementKey)
  })
}

export function useResolvedProps(
  propDefs: Record<string, ControlDefinition>,
  elementData: Record<string, Data>,
  elementKey: string,
): Record<string, unknown> {
  const stylesheetFactory = useStylesheetFactory()
  const resourceResolver = useResourceResolver()
  const controls = useControlInstances(elementKey)

  const resolvablesCache = useRef<Record<string, Resolvable<unknown>>>({}).current
  const resolvables = useMemo(
    () =>
      mapValues(propDefs, (def, propName) =>
        resolvablesCache[propName] != null &&
        elementData[propName] === resolvablesCache[propName].data
          ? resolvablesCache[propName]
          : (resolvablesCache[propName] = def.resolveValue(
              elementData[propName],
              resourceResolver,
              stylesheetFactory.get(propName),
              controls?.[propName],
            )),
      ),
    [propDefs, controls, elementData, resourceResolver, stylesheetFactory],
  )

  const props = useMemo(() => resolveableRecord(resolvables), [resolvables])

  stylesheetFactory.useDefinedStyles()

  useEffect(() => {
    props.triggerResolve()
  })

  return useSyncExternalStore(props.subscribe, props.readStableValue, props.readStableValue)
}

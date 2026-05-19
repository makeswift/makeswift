import { useMemo, useEffect, useRef, useSyncExternalStore, useCallback } from 'react'
import {
  BoxDisplayModel,
  ControlDefinition,
  ControlInstance,
  isNotNil,
  mapValues,
  type Data,
  type Resolvable,
} from '@makeswift/controls'

import * as ReactPage from '../../../state/read-only-state'
import { useResourceResolver } from './use-resource-resolver'
import { useDocumentKey } from './use-document-context'
import { useSelector } from './use-selector'

import { useResolvableRecord } from './use-resolvable-record'
import { propErrorHandlingProxy } from '../utils/prop-error-handling-proxy'
import { useBreakpoints } from './use-breakpoints'
import { StylesheetEngine } from '../../../next/rsc/css/css-runtime'
import { StyleData } from '../../../next/rsc/css/server-css'
import { pollBoxModel } from '../poll-box-model'
import { ElementStyles } from '../../../components/shared/ElementStyles'

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

/*
Notes to self

May well get rid of this.

This is supposed to be 
"things that are generated along the prop resolution path that aren't prop values themselves but are needed by callers"

TODO rename
*/
type Emitted = {
  styles: {

    // Sets up box model polling for the element that a user placed the resolved class name on
    usePollStyledElementBoxModels: () => void

    // Map of className to StyleData
    // TODO reevaluate this
    stylesMap: Map<string, StyleData>

    // renders <style> tags containing css that was serialized from resolved styles during prop resolution
    renderStyles: () => React.ReactNode
  }
}

export function useResolvedProps(
  propDefs: Record<string, ControlDefinition>,
  elementData: Record<string, Data>,
  elementKey: string,
): { props: Record<string, unknown>, emitted: Emitted } {
  const breakpoints = useBreakpoints()
  const resourceResolver = useResourceResolver()
  const controls = useControlInstances(elementKey)

  /*
  Note to self: why use a ref? 

  render 1: Map created, populated during `read` of StableValue
  render 2: Map created, not populated because StableValue `read` returns cached result, no `defineStyle` calls occur to populate new Map
  */
  const stylesMap = useRef<Map<string, StyleData>>(new Map()).current

  const boxModelCallbacks = useRef<Record<string, (boxModel: BoxDisplayModel | null) => void>>({}).current


  // Note to self: the hook below worked much more reliably than the current mechanism is
  // usePollStyledElementBoxModels(elementKey)

  const cache = useRef<Record<string, CacheItem>>({}).current
  const resolveProp = useCallback(
    (def: ControlDefinition, propName: string) => {
      const data = elementData[propName]
      const control = controls?.[propName]

      const stylesheet = new StylesheetEngine(breakpoints, elementKey, [propName], ({ className, css, joinedPropPath, onBoxModelChange }) => {
        stylesMap.set(className, { css, joinedPropPath })

        // Controls pass box model callbacks to `defineStyle`, which passes them along via `onStyleGenerated`
        if (onBoxModelChange) {
          boxModelCallbacks[className] = onBoxModelChange
        }
      })

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
        stylesheet,
        control,
      )

      cache[propName] = { data, control, resolvedValue }
      return resolvedValue
    },
    [controls, elementData, resourceResolver, breakpoints, elementKey, stylesMap],
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

  const emittedStyles = useMemo(() => {
    const usePollStyledElementBoxModels = () => {
      useEffect(() => {
        const unsubscribes = Object.entries(boxModelCallbacks)
          .map(([className, callback]) =>
            callback != null
              ? pollBoxModel({ element: document.querySelector(`.${className}`), onBoxModelChange: callback })
              : undefined,
          )
          .filter(isNotNil)
        return () => unsubscribes.forEach(fn => fn())
      }, [Object.keys(boxModelCallbacks).join(' ')])
    }

    const renderStyles = () => {
      return ElementStyles({ stylesMap })
    }

    return {
      usePollStyledElementBoxModels,
      stylesMap,
      renderStyles,
    }

  }, [elementKey])


  const props = useResolvableRecord(resolvables)

  // no need to call `triggerResolve` on the server, all the resources should already be in
  // the host API client's cache (populated from the snapshot's cache)
  useEffect(() => {
    props.triggerResolve()
  }, [props])

  const resolvedProps = useSyncExternalStore(props.subscribe, props.readStable, props.readStable)

  return {
    props: resolvedProps,
    emitted: {
      styles: emittedStyles,
    },
  }
}

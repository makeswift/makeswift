'use client'

import { type PropsWithChildren, useEffect, useRef, startTransition, useCallback } from 'react'

import { ControlInstance } from '@makeswift/controls'

import { type ElementData } from '../../../../state/read-only-state'
import {
  setResolvedValueOverride,
  clearResolvedValueOverride,
} from '../../../../state/actions/internal/read-write-actions'

import { useServerElementRefresh } from '../../hooks/use-server-element-refresh'
import { useElementData } from '../../hooks/use-element-data'
import { useControlDefs } from '../../hooks/use-control-defs'
import { useEditableElementStylesheetFactory } from '../../hooks/use-editable-element-stylesheet-factory'
import { useResolvedProps } from '../../hooks/use-resolved-props'
import { useControlInstances } from '../../components/control-instances-context'
import { useDispatch } from '../../hooks/use-dispatch'
import { useDocumentKey } from '../../hooks/use-document-context'

import { getProp } from '../../../../utils/prop-by-path'
import { setUnion, setDifference } from '../../../../utils/set'

export const EditableServerElement = ({
  initialElementData,
  children,
}: PropsWithChildren<{ initialElementData: ElementData }>) => {
  const elementKey = initialElementData.key
  const elementData = useElementData({ elementKey })
  if (elementData == null) {
    // Element has been deleted
    // console.error(`@@ EditableServerElement ${elementKey}: Element has been deleted`)
    // FIXME
    return children
  }

  return (
    <EditableServerElementWrapper {...{ initialElementData, elementData }}>
      {children}
    </EditableServerElementWrapper>
  )
}

/**
 * Reflects edits to `elementData.props` in the server-rendered `children`.
 * Changes limited to existing `ReactNode` props are applied through client-side
 * overrides. Style prop changes are handled by the stylesheet engine during
 * prop resolution. All other prop changes trigger a server refresh.
 */
const EditableServerElementWrapper = ({
  initialElementData,
  elementData,
  children,
}: PropsWithChildren<{ initialElementData: ElementData; elementData: ElementData }>) => {
  const elementKey = initialElementData.key
  const dispatch = useDispatch()
  const documentKey = useDocumentKey()

  const [_legacyDefs, definitions] = useControlDefs({ elementType: initialElementData.type })
  const stylesheetFactory = useEditableElementStylesheetFactory({ elementKey })

  const controlInstances = useControlInstances(elementKey)
  const resolvedProps = useResolvedProps({
    elementKey,
    propDefs: definitions,
    propData: elementData.props,
    controlInstances,
    stylesheetFactory,
  })

  const prevPropsRef = useRef(resolvedProps)
  const prevLeafPropsRef = useRef(
    getLeafPropsAndInstances(resolvedProps, controlInstances).leafProps,
  )

  const serverRefresh = useServerElementRefresh({ elementKey })
  const applyServerRefresh = useCallback(
    (elementData: ElementData, leafInstances: ControlInstance[], documentKey: string) =>
      startTransition(async () => {
        const applied = await serverRefresh(elementData)
        if (!applied) return

        // need a nested `startTransition` here, see
        // https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition
        startTransition(() => {
          // reset instance overrides, if any
          leafInstances.forEach(c =>
            dispatch(clearResolvedValueOverride({ documentKey, instanceKey: c.instanceKey })),
          )
        })
      }),
    [serverRefresh, dispatch],
  )

  const applyResolvedValueOverrides = useCallback(
    (instances: ControlInstance[], props: Record<string, unknown>, documentKey: string) =>
      instances.forEach(c =>
        dispatch(
          setResolvedValueOverride({
            documentKey,
            instanceKey: c.instanceKey,
            value: getProp(props, c.propPath),
          }),
        ),
      ),
    [dispatch],
  )

  useEffect(() => {
    if (documentKey == null) return

    if (children == null) {
      // If we don't have a server-rendered node (i.e. user just dropped the element to the page),
      // trigger a server re-render
      const { leafInstances, leafProps } = getLeafPropsAndInstances(resolvedProps, controlInstances)

      applyServerRefresh(elementData, leafInstances, documentKey)

      prevPropsRef.current = resolvedProps
      prevLeafPropsRef.current = leafProps
      return
    }

    if (resolvedProps !== prevPropsRef.current) {
      // If there was a change in resolved value, check if any of the changed props necessitate
      // a server refresh.
      //
      // Note that style props have stable class names and updating a style prop will not result
      // in a change to the resolved value, which is what we want. The stylesheet engine takes
      // care of updating the client CSS on style prop updates through the `useResolvedProps` call.
      const { needsRefresh, leafInstances, leafProps, reactNodeInstances } = needsServerRefresh({
        resolvedProps,
        controlInstances,
        prevProps: prevPropsRef.current,
        prevLeafProps: prevLeafPropsRef.current,
      })

      if (needsRefresh) {
        applyServerRefresh(elementData, leafInstances, documentKey)
      } else {
        applyResolvedValueOverrides(reactNodeInstances, resolvedProps, documentKey)
      }

      prevPropsRef.current = resolvedProps
      prevLeafPropsRef.current = leafProps
    }
  }, [
    children,
    resolvedProps,
    documentKey,
    elementData,
    controlInstances,
    applyServerRefresh,
    applyResolvedValueOverrides,
  ])

  return children
}

/**
 * Determines whether resolved prop changes require a server refresh and returns
 * the control-instance state needed to apply the update.
 */
const needsServerRefresh = ({
  resolvedProps,
  controlInstances,
  prevProps,
  prevLeafProps,
}: {
  resolvedProps: Record<string, unknown>
  controlInstances: Record<string, ControlInstance> | null
  prevProps: Record<string, unknown>
  prevLeafProps: Set<string>
}): {
  needsRefresh: boolean
  leafInstances: ControlInstance[]
  leafProps: Set<string>
  reactNodeInstances: ControlInstance[]
} => {
  const { leafInstances, leafProps } = getLeafPropsAndInstances(resolvedProps, controlInstances)

  const combinedLeafProps = setUnion(leafProps, prevLeafProps).values()
  const updatedLeafProps = new Set(
    [...combinedLeafProps].filter(
      propName => getProp(resolvedProps, propName) !== getProp(prevProps, propName),
    ),
  )

  const updatedLeafInstances = leafInstances.filter(instance =>
    updatedLeafProps.has(instance.propPath),
  )

  const reactNodeInstances = updatedLeafInstances.filter(c => c.resolvesToRenderableNode())

  const reactNodePropKeys = new Set(reactNodeInstances.map(c => c.propPath))
  const newlyAddedLeafProps = setDifference(leafProps, prevLeafProps)

  // A server refresh is needed if some of the updated props are not `ReactNode` props, or we
  // have newly observed props (typically `List` items). Even when newly observed props are
  // `ReactNode` props, we have to first render them on the server to get them in the element
  // tree before they can be updated client-side.
  const needsRefresh =
    setDifference(updatedLeafProps, reactNodePropKeys).size > 0 || newlyAddedLeafProps.size > 0

  return {
    needsRefresh,
    leafInstances,
    leafProps,
    reactNodeInstances,
  }
}

/**
 *  Returns terminal prop paths with the corresponding control instances.
 */
const getLeafPropsAndInstances = (
  props: Record<string, unknown>,
  controlInstances: Record<string, ControlInstance> | null,
): {
  leafProps: Set<string>
  leafInstances: ControlInstance[]
} => {
  const topLevelInstances = Object.keys(props)
    .map(prop => controlInstances?.[prop])
    .filter(inst => inst != null)

  const leafInstances = getLeafInstances(topLevelInstances)
  const leafProps = new Set(leafInstances.map(c => c.propPath))
  return { leafProps, leafInstances }
}

/**
 * Flattens a control instance tree to its leaf (terminal) instances.
 */
const getLeafInstances = (instances: ControlInstance[]): ControlInstance[] =>
  instances.flatMap(instance =>
    instance.isCompositeProp() ? getLeafInstances(instance.children()) : [instance],
  )

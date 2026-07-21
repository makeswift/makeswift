'use client'

import { type PropsWithChildren, useEffect, useRef, startTransition } from 'react'

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

export const EditableServerElement = ({
  initialElementData,
  children,
}: PropsWithChildren<{ initialElementData: ElementData }>) => {
  const elementKey = initialElementData.key
  const elementData = useElementData({ elementKey })
  return elementData ? (
    <EditableServerElementWrapper {...{ initialElementData, elementData }}>
      {children}
    </EditableServerElementWrapper>
  ) : (
    <DeletedServerElementWrapper elementKey={elementKey} />
  )
}

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

  const controlInstances = useControlInstances()
  const resolvedProps = useResolvedProps({
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

  console.log('@@ resolvedProps', resolvedProps)

  useEffect(() => {
    if (documentKey == null) return

    if (children == null) {
      // If we don't have a server-rendered node (i.e. user just dropped the element to the page),
      // trigger a server re-render
      startTransition(async () => await serverRefresh(elementData))
      return
    }

    if (resolvedProps !== prevPropsRef.current) {
      // If there was a change in resolved value, check if all the updated props that participated
      // in the change are `ReactNode` props

      const { leafInstances, leafProps } = getLeafPropsAndInstances(resolvedProps, controlInstances)

      const combinedLeafProps = leafProps.union(prevLeafPropsRef.current).values()
      const updatedLeafProps = new Set(
        combinedLeafProps.filter(
          propName => getProp(resolvedProps, propName) !== getProp(prevPropsRef.current, propName),
        ),
      )

      const updatedLeafInstances = leafInstances.filter(instance =>
        updatedLeafProps.has(instance.propPath),
      )

      const reactNodeInstances = updatedLeafInstances.filter(c => c.resolvesToRenderableNode())

      const reactNodePropKeys = new Set(reactNodeInstances.map(c => c.propPath))
      const newlyAddedLeafProps = leafProps.difference(prevLeafPropsRef.current)

      console.log('@@ EditableServerElementWrapper', {
        resolvedProps,
        leafProps,
        prevLeafProps: prevLeafPropsRef.current,
        reactNodePropKeys,
        updatedLeafProps,
        newlyAddedLeafProps,
      })

      if (updatedLeafProps.difference(reactNodePropKeys).size > 0 || newlyAddedLeafProps.size > 0) {
        // Some of the updated props are not `ReactNode` props, or we have newly observed props
        // (typically `List` items). Even when newly observed props are `ReactNode` props, we have
        // to first render them on the server to get them in the element tree before they can be
        // updated client-side.
        //
        // Note that style props have stable class names and updating a style prop will not result
        // in a change to the resolved value and will not trigger a server round-trip here, which is
        // what we want. The stylesheet engine takes care of updating the client CSS on style prop
        // updates through the `useResolvedProps` call above.
        console.log(
          '@@ re-rendering element on the server',
          elementKey,
          resolvedProps,
          prevPropsRef.current,
        )

        startTransition(async () => {
          await serverRefresh(elementData)

          // need a nested `startTransition` here, see
          // https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition
          startTransition(() => {
            // reset instance overrides, if any
            leafInstances.forEach(c =>
              dispatch(clearResolvedValueOverride({ documentKey, instanceKey: c.instanceKey })),
            )
          })
        })
      } else {
        reactNodeInstances.forEach(c =>
          dispatch(
            setResolvedValueOverride({
              documentKey,
              instanceKey: c.instanceKey,
              value: getProp(resolvedProps, c.propPath),
            }),
          ),
        )
      }

      prevPropsRef.current = resolvedProps
      prevLeafPropsRef.current = leafProps
    }
  }, [
    children,
    resolvedProps,
    documentKey,
    elementKey,
    elementData,
    controlInstances,
    serverRefresh,
    dispatch,
  ])

  // Rerender on the server when any resource changes
  // FIXME: might be unnecessary?
  // useEffect(
  //   () =>
  //     actionListener.startListening({
  //       type: HostActionTypes.CHANGE_API_RESOURCE,
  //       effect: () => {
  //         console.log('@@ API resource changed, refreshing element', elementKey)
  //         serverRefresh(elementData)
  //       },
  //     }),
  //   [serverRefresh, elementData],
  // )

  return children
}

const getProp = (props: Record<string, unknown>, path: string): unknown =>
  getPropByPath(props, path.split('.'))

const getPropByPath = (
  props: Record<string, unknown> | Array<unknown>,
  [key, ...path]: string[],
): unknown => {
  const r = Array.isArray(props) ? props[Number.parseInt(key, 10)] : props[key]
  return path.length > 0 && r != null ? getPropByPath(r as typeof props, path) : r
}

const getLeafPropsAndInstances = (
  props: Record<string, unknown>,
  controlInstances: Record<string, ControlInstance> | null,
) => {
  const topLevelInstances = Object.keys(props)
    .map(prop => controlInstances?.[prop])
    .filter(inst => inst != null)

  const leafInstances = getLeafInstances(topLevelInstances)
  const leafProps = new Set(leafInstances.map(c => c.propPath))
  return { leafProps, leafInstances }
}

/**
 * Flattens a control instance tree to its leaf instances.
 */
const getLeafInstances = (instances: ControlInstance[]): ControlInstance[] =>
  instances.flatMap(instance =>
    instance.isCompositeProp() ? getLeafInstances(instance.children()) : [instance],
  )

const DeletedServerElementWrapper = ({ elementKey }: { elementKey: string }) => {
  console.log('@@ DeletedServerElementWrapper', elementKey)
  return null
}

'use client'

import { type PropsWithChildren, useEffect, useRef } from 'react'

import { type ElementData } from '../../../../state/read-only-state'

import { useServerElementRefresh } from '../../hooks/use-server-element-refresh'
import { useElementData } from '../../hooks/use-element-data'
import { useControlDefs } from '../../hooks/use-control-defs'
import { useEditableElementStylesheetFactory } from '../../hooks/use-editable-element-stylesheet-factory'
import { useResolvedProps } from '../../hooks/use-resolved-props'
import { useControlInstances } from '../../components/control-instances-context'

export const EditableServerElement = ({
  initialElementData,
  children,
}: PropsWithChildren<{ initialElementData: ElementData }>) => {
  const elementKey = initialElementData.key
  const elementData = useElementData({ elementKey })
  console.log('@@@ EditableServerElement', elementData)
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

  const [_legacyDefs, definitions] = useControlDefs({ elementType: initialElementData.type })
  const stylesheetFactory = useEditableElementStylesheetFactory({ elementKey })

  const controlInstances = useControlInstances()
  const resolvedProps = useResolvedProps({
    propDefs: definitions,
    propData: elementData.props,
    elementKey: elementData.key,
    controlInstances,
    stylesheetFactory,
  })

  const prevPropsRef = useRef(resolvedProps)
  const serverRefresh = useServerElementRefresh({ elementKey })

  useEffect(() => {
    if (children == null || resolvedProps !== prevPropsRef.current) {
      // Trigger a server re-render if we don't have a server-rendered node (i.e. user just dropped
      // the element to the page) or if there was a change in resolved value. Note that style props
      // have stable class names and updating a style prop will not result in a change to the
      // resolved value and will not trigger a server round-trip here, which is what we want. The
      // stylesheet engine takes care of updating the client CSS on style prop updates through the
      // `useResolvedProps` call above.
      console.log(
        '@@ Non-style prop changed, refreshing element',
        elementKey,
        resolvedProps,
        prevPropsRef.current,
      )
      serverRefresh(elementData)

      prevPropsRef.current = resolvedProps
    }
  }, [resolvedProps, serverRefresh, elementData])

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

const DeletedServerElementWrapper = ({ elementKey }: { elementKey: string }) => {
  console.log('@@ DeletedServerElementWrapper', elementKey)
  return null
}

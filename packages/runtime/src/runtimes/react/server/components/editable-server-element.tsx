'use client'

import { type PropsWithChildren, useEffect, useRef } from 'react'

import { type ElementData } from '../../../../state/read-only-state'
import { actionListener } from '../../../../state/middleware/action-listener'
import { HostActionTypes } from '../../../../state/host-api'

import { useServerElementRefresh } from '../../hooks/use-server-element-refresh'
import { useElementData } from '../../hooks/use-element-data'
import { useControlDefs } from '../../hooks/use-control-defs'
import { useEditableElementStylesheetFactory } from '../../hooks/use-editable-element-stylesheet-factory'
import { useResolvedProps } from '../../hooks/use-resolved-props'

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

  const [_legacyDefs, definitions] = useControlDefs({ elementType: initialElementData.type })
  const stylesheetFactory = useEditableElementStylesheetFactory({ elementKey })

  const resolvedProps = useResolvedProps({
    propDefs: definitions,
    propData: elementData.props,
    elementKey: elementData.key,
    stylesheetFactory,
  })

  const prevPropsRef = useRef(resolvedProps)
  const serverRefresh = useServerElementRefresh({ elementKey })

  useEffect(() => {
    if (resolvedProps !== prevPropsRef.current) {
      // Style prop changes update CSS directly via the stylesheet engine, producing stable class
      // names without changing the resolved value (which is the class name, not the CSS itself).
      // A change in resolved value therefore means a non-style prop update, so we need to trigger
      // a server re-render.
      console.log('@@ Non-style prop changed, refreshing element', elementKey)
      serverRefresh(elementData)

      prevPropsRef.current = resolvedProps
    }
  }, [resolvedProps, serverRefresh, elementData])

  // Rerender on the server when any resource changes
  // FIXME: might be unnecessary?
  useEffect(
    () =>
      actionListener.startListening({
        type: HostActionTypes.CHANGE_API_RESOURCE,
        effect: () => {
          console.log('@@ API resource changed, refreshing element', elementKey)
          serverRefresh(elementData)
        },
      }),
    [serverRefresh, elementData],
  )

  return children
}

const DeletedServerElementWrapper = ({ elementKey }: { elementKey: string }) => {
  console.log('@@ DeletedServerElementWrapper', elementKey)
  return null
}

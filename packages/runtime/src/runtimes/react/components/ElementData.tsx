import { type ReactNode, type Ref, forwardRef, memo } from 'react'

import { type ElementData as MakeswiftElementData } from '../../../state/read-only-state'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'

import { EditableServerElement } from '../server/components/editable-server-element'
import { useServerElementsCache } from '../server/components/server-elements-cache'

import { useBuiltinSuspense } from '../hooks/use-builtin-suspense'
import { useComponent, useComponentMeta } from '../hooks/use-component'
import { useIsReadOnly } from '../hooks/use-is-read-only'

import { canAcceptRef } from '../utils/can-accept-ref'

import { ResolveProps } from './resolve-props'
import { ActivityOrFallback } from './activity-with-fallback'

type ElementDataProps = {
  elementData: MakeswiftElementData
}

export const ElementData = memo(
  forwardRef(function ElementData({ elementData }: ElementDataProps, ref: Ref<unknown>): ReactNode {
    const componentMeta = useComponentMeta(elementData.type)

    if (componentMeta == null) {
      const msg = `Component metadata not found for '${elementData.type}'`
      console.warn(msg)
      return (
        <FallbackComponent
          ref={ref as Ref<HTMLDivElement>}
          text="Component not found"
          details={msg}
        />
      )
    }

    return componentMeta.server ? (
      <ElementDataServer elementData={elementData} ref={ref} />
    ) : (
      <ElementDataClient elementData={elementData} ref={ref} />
    )
  }),
)

const ElementDataServer = forwardRef(function ElementDataServer(
  { elementData }: ElementDataProps,
  ref: Ref<unknown>,
): ReactNode {
  // lookup and render RSC node for the element; see the `ServerElementsCache` comment
  const rscNode = useServerElementsCache().getElement(elementData.key)
  const isReadOnly = useIsReadOnly()

  if (isReadOnly) {
    if (rscNode == null) {
      console.error(
        `React node not found for server component ${elementData.type}, element key ${elementData.key}`,
      )

      return (
        <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Server component not found" />
      )
    }

    return rscNode
  }

  return <EditableServerElement initialElementData={elementData}>{rscNode}</EditableServerElement>
})

const ElementDataClient = forwardRef(function ElementDataClient(
  { elementData }: ElementDataProps,
  ref: Ref<unknown>,
): ReactNode {
  const Component = useComponent(elementData.type)
  const builtinSuspense = useBuiltinSuspense(elementData.type)

  if (Component == null) {
    console.warn(`Unknown component '${elementData.type}'`, { elementData })
    return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
  }

  const forwardRef = canAcceptRef(Component)

  return (
    <ActivityOrFallback suspenseFallback={builtinSuspense}>
      <ResolveProps element={elementData}>
        {props =>
          forwardRef ? (
            <Component {...props} key={elementData.key} ref={ref} />
          ) : (
            <Component {...props} key={elementData.key} />
          )
        }
      </ResolveProps>
    </ActivityOrFallback>
  )
})

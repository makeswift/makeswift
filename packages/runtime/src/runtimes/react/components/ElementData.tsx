import { Ref, forwardRef, memo, ReactNode } from 'react'

import { ElementData as ReactPageElementData } from '../../../state/read-only-state'
import { useBuiltinSuspense } from '../hooks/use-builtin-suspense'
import { useComponent, useComponentMeta } from '../hooks/use-component'
import { canAcceptRef } from '../utils/can-accept-ref'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { useServerElementsCache } from '../server/components/server-elements-cache'
import { ResolveProps } from '../controls'

import { ActivityOrFallback } from './activity-with-fallback'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const ElementData = memo(
  forwardRef(function ElementData({ elementData }: ElementDataProps, ref: Ref<unknown>): ReactNode {
    const componentMeta = useComponentMeta(elementData.type)

    if (componentMeta == null) {
      console.warn(`Component metadata not found for ${elementData.type}`)
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
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
  const rscNode = useServerElementsCache().getElement(elementData.key)

  if (rscNode == null) {
    console.warn(
      `React node not found for server component ${elementData.type}, element key ${elementData.key}`,
    )

    return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Server component not found" />
  }

  return rscNode
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

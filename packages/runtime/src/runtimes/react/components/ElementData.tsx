import { Ref, forwardRef, memo, ReactNode, useCallback } from 'react'

import { ElementData as ReactPageElementData } from '../../../state/read-only-state'
import { useBuiltinSuspense } from '../hooks/use-builtin-suspense'
import { useComponent } from '../hooks/use-component'
import { canAcceptRef } from '../utils/can-accept-ref'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { ResolveProps } from './resolve-props'
import { ActivityOrFallback } from './activity-with-fallback'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const ElementData = memo(
  forwardRef(function ElementData({ elementData }: ElementDataProps, ref: Ref<unknown>): ReactNode {
    const Component = useComponent(elementData.type)
    const builtinSuspense = useBuiltinSuspense(elementData.type)

    if (Component == null) {
      console.warn(`Unknown component '${elementData.type}'`, { elementData })
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    const forwardRef = canAcceptRef(Component)

    const renderChildren = useCallback((props: Record<string, unknown>) => {
      return (
        forwardRef ? (
          <Component {...props} key={elementData.key} ref={ref} />
        ): (
          <Component {...props} key={elementData.key} />
        )
      )
    }, [forwardRef, elementData.key, ref, Component])

    return (
      <ActivityOrFallback suspenseFallback={builtinSuspense}>
        <ResolveProps element={elementData}>
          {renderChildren}
        </ResolveProps>
      </ActivityOrFallback>
    )
  }),
)

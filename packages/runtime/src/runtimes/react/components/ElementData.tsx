import { Ref, Suspense, Fragment, forwardRef, memo } from 'react'
import { ElementData as ReactPageElementData } from '../../../state/react-page'
import { useBuiltinSuspense } from '../hooks/use-builtin-suspense'
import { useComponent } from '../hooks/use-component'
import { canAcceptRef } from '../utils/can-accept-ref'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { ResolveProps } from '../controls'
import { ActivityWithFallback } from './activity-with-fallback'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const ElementData = memo(
  forwardRef(function ElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const Component = useComponent(elementData.type)
    const builtinSuspense = useBuiltinSuspense(elementData.type)

    if (Component == null) {
      console.warn(`Unknown component '${elementData.type}'`, { elementData })
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    const forwardRef = canAcceptRef(Component)
    const SuspenseOrFragment = builtinSuspense ? Suspense : Fragment

    return (
      <ActivityWithFallback fallback={SuspenseOrFragment}>
        <ResolveProps element={elementData}>
          {props =>
            forwardRef ? (
              <Component {...props} key={elementData.key} ref={ref} />
            ) : (
              <Component {...props} key={elementData.key} />
            )
          }
        </ResolveProps>
      </ActivityWithFallback>
    )
  }),
)

import { Ref, Suspense, forwardRef, memo } from 'react'
import { ElementData as ReactPageElementData } from '../../../state/react-page'
import { useComponent } from '../hooks/use-component'
import { canAcceptRef } from '../utils/can-accept-ref'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { ResolveProps } from '../controls'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const ElementData = memo(
  forwardRef(function ElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const Component = useComponent(elementData.type)

    if (Component == null) {
      console.warn(`Unknown component '${elementData.type}'`, { elementData })
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    const forwardRef = canAcceptRef(Component)

    return (
      <Suspense>
        <ResolveProps element={elementData}>
          {props =>
            forwardRef ? (
              <Component {...props} key={elementData.key} ref={ref} />
            ) : (
              <Component {...props} key={elementData.key} />
            )
          }
        </ResolveProps>
      </Suspense>
    )
  }),
)

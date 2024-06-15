import { Ref, Suspense, forwardRef, memo } from 'react'
import { ElementData as ReactPageElementData } from '../../../state/react-page'
import { useComponent } from '../hooks/use-component'
import { suppressRefWarning } from '../utils/suppress-ref-warning'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { PropsValue } from '../controls'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const ElementData = memo(
  forwardRef(function ElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const Component = useComponent(elementData.type)

    suppressRefWarning(`\`ForwardRef(${ElementData.name})\``)

    if (Component == null) {
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    return (
      <Suspense>
        {/* {PropsValue({
          element: elementData,
          children: props => <Component {...props} key={elementData.key} ref={ref} />,
        })} */}

        <PropsValue element={elementData}>
          {props => <Component {...props} key={elementData.key} ref={ref} />}
        </PropsValue>
      </Suspense>
    )
  }),
)

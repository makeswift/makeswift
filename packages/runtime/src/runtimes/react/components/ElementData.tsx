import { Ref, Suspense, forwardRef, memo } from 'react'
import { ElementData as ReactPageElementData } from '../../../state/react-page'
import { useComponent } from '../hooks/use-component'
import { canAcceptRef } from '../utils/can-accept-ref'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { ResolveProps } from '../controls'
import { getComponentsMeta } from '../../../state/modules/components-meta'
import { useStore } from '../hooks/use-store'
import { useRSCNodes } from '../../../next/rsc/context/RSCNodesProvider'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const ElementData = memo(
  forwardRef(function ElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const Component = useComponent(elementData.type)
    const store = useStore()
    const meta = getComponentsMeta(store.getState().componentsMeta).get(elementData.type)
    const rscNodes = useRSCNodes()

    if (meta == null) {
      console.warn(`Component meta not found for ${elementData.type}`)
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    if (meta.server) {
      const rscNode = rscNodes[elementData.key]

      if (rscNode == null) {
        console.warn(`RSC node not found for ${elementData.key}`)
        return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="RSC node not found" />
      }

      return rscNode
    }

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

'use client'

import { Ref, forwardRef, memo } from 'react'
import { ElementData as ReactPageElementData } from '../../../state/react-page'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { getComponentsMeta } from '../../../state/modules/components-meta'
import { useStore } from '../../../runtimes/react/hooks/use-store'
import { useRSCNodes } from '../context/RSCNodesProvider'
import { ElementData } from '../../../runtimes/react/components/ElementData'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const RSCElementData = memo(
  forwardRef(function RSCElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
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

    return <ElementData elementData={elementData} ref={ref} />
  }),
)

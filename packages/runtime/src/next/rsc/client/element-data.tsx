'use client'

import { Ref, forwardRef, memo } from 'react'
import { ElementData as ReactPageElementData } from '../../../state/react-page'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { useRSCNode } from './rsc-nodes-provider'
import { ElementData } from '../../../runtimes/react/components/ElementData'
import { useComponentMeta } from '../../../runtimes/react/hooks/use-component-meta'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const RSCElementData = memo(
  forwardRef(function RSCElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const componentMeta = useComponentMeta(elementData.type)
    const rscNode = useRSCNode(elementData.key)

    if (componentMeta == null) {
      console.warn(`Component meta not found for ${elementData.type}`)
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    if (!componentMeta.server) {
      return <ElementData elementData={elementData} ref={ref} />
    }

    if (rscNode == null) {
      console.warn(`RSC node not found for ${elementData.key}`)
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="RSC node not found" />
    }

    return rscNode
  }),
)

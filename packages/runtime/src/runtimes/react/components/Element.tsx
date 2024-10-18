'use client'

import { forwardRef, memo, ReactNode, Ref } from 'react'
import { isElementReference, type Element as ReactPageElement } from '../../../state/react-page'
import { RegisterChildrenAsElement } from './RegisterChildrenAsElement'
import { ElementReference } from './ElementReference'
import { ElementData } from './ElementData'
import { ElementImperativeHandle } from '../element-imperative-handle'

type ElementWithFallbackProps = {
  element: ReactPageElement
  fallback?: ReactNode
  isInitialData?: boolean
}

export const ElementWithFallback = memo(
  forwardRef(function Element(
    { element, fallback, isInitialData = false }: ElementWithFallbackProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element | null {
    const showFallback = fallback != null && isInitialData
    return (
      <RegisterChildrenAsElement elementKey={element.key}>
        {showFallback ? (
          fallback
        ) : isElementReference(element) ? (
          <ElementReference key={element.key} ref={ref} elementReference={element} />
        ) : (
          <ElementData key={element.key} ref={ref} elementData={element} />
        )}
      </RegisterChildrenAsElement>
    )
  }),
)

type ElementProps = {
  element: ReactPageElement
}

export const Element = memo(
  forwardRef(function Element(
    { element }: ElementProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element | null {
    return <ElementWithFallback element={element} ref={ref} />
  }),
)

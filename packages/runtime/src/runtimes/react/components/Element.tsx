'use client'

import { forwardRef, memo, ReactNode, Ref, useCallback, useImperativeHandle, useRef } from 'react'
import { isElementReference, type Element as ElementDataOrRef } from '../../../state/react-page'
import { ElementRegistration } from './ElementRegistration'
import { ElementReference } from './ElementReference'
import { ElementData } from './ElementData'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { FindDomNode } from '../find-dom-node'

type ElementWithFallbackProps = {
  element: ElementDataOrRef
  fallback?: ReactNode
  isInitialData?: boolean
}

export const ElementWithFallback = memo(
  forwardRef(function Element(
    { element, fallback, isInitialData = false }: ElementWithFallbackProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element | null {
    const showFallback = fallback != null && isInitialData

    const useFindDomNodeRef = useRef(true)
    const imperativeHandleRef = useRef(new ElementImperativeHandle())

    const fallbackCallbackRef = useCallback((current: (() => Element | Text | null) | null) => {
      imperativeHandleRef.current.callback(() => current?.() ?? null)
    }, [])

    const findDomNodeCallbackRef = useCallback((current: (() => Element | Text | null) | null) => {
      if (useFindDomNodeRef.current === true) {
        imperativeHandleRef.current.callback(() => current?.() ?? null)
      }
    }, [])

    const elementCallbackRef = useCallback((current: unknown | null) => {
      useFindDomNodeRef.current = false

      imperativeHandleRef.current.callback(() => current)
    }, [])

    useImperativeHandle(ref, () => imperativeHandleRef.current, [])

    return (
      <ElementRegistration componentHandle={imperativeHandleRef.current} elementKey={element.key}>
        {showFallback ? (
          <FindDomNode ref={fallbackCallbackRef}>{fallback}</FindDomNode>
        ) : (
          <FindDomNode ref={findDomNodeCallbackRef}>
            {isElementReference(element) ? (
              <ElementReference
                key={element.key}
                ref={elementCallbackRef}
                elementReference={element}
              />
            ) : (
              <ElementData key={element.key} ref={elementCallbackRef} elementData={element} />
            )}
          </FindDomNode>
        )}
      </ElementRegistration>
    )
  }),
)

type ElementProps = {
  element: ElementDataOrRef
}

export const Element = memo(
  forwardRef(function Element(
    { element }: ElementProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element | null {
    return <ElementWithFallback element={element} ref={ref} />
  }),
)

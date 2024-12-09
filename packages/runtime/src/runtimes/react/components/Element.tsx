'use client'

import { forwardRef, memo, Ref, useCallback, useImperativeHandle, useRef } from 'react'
import { isElementReference, type Element as ElementDataOrRef } from '../../../state/react-page'
import { ElementRegistration } from './ElementRegistration'
import { ElementReference } from './ElementReference'
import { ElementData } from './ElementData'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { FindDomNode } from '../find-dom-node'

type Props = {
  element: ElementDataOrRef
}

export const Element = memo(
  forwardRef(function Element(
    { element }: Props,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element | null {
    const useFindDomNodeRef = useRef(true)
    const imperativeHandleRef = useRef(new ElementImperativeHandle())

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
      </ElementRegistration>
    )
  }),
)

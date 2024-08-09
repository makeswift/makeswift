'use client'

import { Ref, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { Element as ElementDataOrRef, isElementReference } from '../../../state/react-page'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { useDispatch } from '../hooks/use-dispatch'
import { useDocumentKey } from '../hooks/use-document-key'
import { useDisableRegisterElement } from '../hooks/use-disable-register-element'
import { mountComponentEffect, registerComponentHandleEffect } from '../../../state/actions'
import { ElementReference } from './ElementReference'
import { ElementData } from './ElementData'
import { FindDomNode } from '../find-dom-node'

type ElementProps = {
  element: ElementDataOrRef
}

export const Element = memo(
  forwardRef(function Element(
    { element }: ElementProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const elementKey = element.key
    const dispatch = useDispatch()
    const documentKey = useDocumentKey()
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
    const isRegisterElementDisabled = useDisableRegisterElement()

    useImperativeHandle(ref, () => imperativeHandleRef.current, [])

    useEffect(() => {
      if (documentKey == null || isRegisterElementDisabled) return

      return dispatch(
        registerComponentHandleEffect(documentKey, elementKey, imperativeHandleRef.current),
      )
    }, [dispatch, documentKey, elementKey, isRegisterElementDisabled])

    useEffect(() => {
      if (documentKey == null || isRegisterElementDisabled) return

      return dispatch(mountComponentEffect(documentKey, elementKey))
    }, [dispatch, documentKey, elementKey, isRegisterElementDisabled])

    return (
      <FindDomNode ref={findDomNodeCallbackRef}>
        {isElementReference(element) ? (
          <ElementReference key={elementKey} ref={elementCallbackRef} elementReference={element} />
        ) : (
          <ElementData key={elementKey} ref={elementCallbackRef} elementData={element} />
        )}
      </FindDomNode>
    )
  }),
)

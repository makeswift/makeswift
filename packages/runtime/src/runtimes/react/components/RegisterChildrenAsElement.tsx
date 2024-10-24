'use client'

import {
  ReactNode,
  Ref,
  cloneElement,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { useDispatch } from '../hooks/use-dispatch'
import { useDocumentKey } from '../hooks/use-document-context'
import { useDisableRegisterElement } from '../hooks/use-disable-register-element'
import { mountComponentEffect, registerComponentHandleEffect } from '../../../state/actions'
import { FindDomNode } from '../find-dom-node'

type RefWrapperProps = {
  children?: ReactNode | null
}

const RefWrapper = forwardRef(({ children }: RefWrapperProps, ref) => {
  if (children == null) return null
  return cloneElement(<>{children}</>, { ref })
})

type RegisterChildrenAsElementProps = {
  elementKey: string
  children?: ReactNode
}

export const RegisterChildrenAsElement = memo(
  forwardRef(function RegisteredElementWithFallback(
    { elementKey, children }: RegisterChildrenAsElementProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
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
        <RefWrapper ref={elementCallbackRef}>{children}</RefWrapper>
      </FindDomNode>
    )
  }),
)

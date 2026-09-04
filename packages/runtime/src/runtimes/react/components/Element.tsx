'use client'

import {
  type ReactNode,
  type Ref,
  type PropsWithChildren,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  lazy,
} from 'react'

import {
  isElementReference,
  type Element as ElementDataOrRef,
} from '../../../state/read-only-state'

import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary'

import { useIsReadOnly } from '../hooks/use-is-read-only'
import { useIsRegisterElementDisabled } from '../hooks/use-disable-register-element'

import { ElementImperativeHandle } from '../element-imperative-handle'
import { FindDomNode } from '../find-dom-node'

import { ElementReference } from './ElementReference'
import { ElementData } from './ElementData'

const BuilderElementRegistration = lazy(() => import('./ElementRegistration'))

type Props = {
  element: ElementDataOrRef
}

export const Element = memo(
  forwardRef(function Element(
    { element }: Props,
    ref: Ref<ElementImperativeHandle>,
  ): ReactNode | null {
    const { imperativeHandleRef, findDomNodeCallbackRef, elementCallbackRef } =
      useElementImperativeHandle(ref)

    const isRegisterElementDisabled = useIsRegisterElementDisabled()
    const ElementRegistration =
      useIsReadOnly() || isRegisterElementDisabled ? NoOp : BuilderElementRegistration

    console.log('@@@ Element (client)', { element })
    return (
      <ElementRegistration
        componentHandle={imperativeHandleRef.current}
        elementKey={element.key}
        componentType={element.type}
      >
        <FindDomNode ref={findDomNodeCallbackRef}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {isElementReference(element) ? (
              <ElementReference
                key={element.key}
                ref={elementCallbackRef}
                elementReference={element}
              />
            ) : (
              <ElementData key={element.key} ref={elementCallbackRef} elementData={element} />
            )}
          </ErrorBoundary>
        </FindDomNode>
      </ElementRegistration>
    )
  }),
)

/**
 * Creates an `ElementImperativeHandle` instance that reports the element's DOM location to
 * the builder.
 *
 * Uses the element's attached ref when available; otherwise, falls back to React's
 * `findDOMNode` to locate the rendered DOM node.
 */
function useElementImperativeHandle(ref: Ref<ElementImperativeHandle>) {
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

  return { imperativeHandleRef, findDomNodeCallbackRef, elementCallbackRef }
}

function NoOp({ children }: PropsWithChildren) {
  return children
}

function ErrorFallback() {
  return <FallbackComponent text={`Error rendering component`} />
}

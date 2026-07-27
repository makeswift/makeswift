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

    const ElementRegistration = useIsReadOnly() ? NoOp : BuilderElementRegistration

    return (
      <ElementRegistration componentHandle={imperativeHandleRef.current} elementKey={element.key}>
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

function NoOp({ children }: PropsWithChildren) {
  return children
}

function ErrorFallback() {
  return <FallbackComponent text={`Error rendering component`} />
}

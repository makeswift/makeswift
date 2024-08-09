import { Ref, Suspense, forwardRef, memo } from 'react'
import { ElementData as ReactPageElementData } from '../../../state/react-page'
import { useComponent } from '../hooks/use-component'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { PropsValue } from '../controls'

type ElementDataProps = {
  elementData: ReactPageElementData
}

function hasTypeofSymbol(Component: any, symbol: string) {
  return Component && Component.type && Component.$$typeof?.toString() === `Symbol(${symbol})`
}

function isMemoComponent(Component: any) {
  return hasTypeofSymbol(Component, 'react.memo')
}

function unwrapIfMemo(Component: any) {
  return isMemoComponent(Component) ? Component.type : Component
}

function isForwardRef(Component: any) {
  return hasTypeofSymbol(Component, 'react.forward_ref')
}

function isClassComponent(Component: any) {
  return (
    typeof Component === 'function' && Component.prototype && Component.prototype.isReactComponent
  )
}

function isLazyComponent(Component: any) {
  return hasTypeofSymbol(Component, 'react.lazy')
}

function canAcceptRef(Component: any) {
  return (
    isClassComponent(Component) ||
    isForwardRef(Component) ||
    // will try to pass a ref to all lazy components since we can't know if they accept refs without loading them
    isLazyComponent(Component)
  )
}

export const ElementData = memo(
  forwardRef(function ElementData(
    { elementData }: ElementDataProps,
    ref: Ref<unknown>,
  ): JSX.Element {
    const Component = useComponent(elementData.type)
    const forwardRef = canAcceptRef(unwrapIfMemo(Component))

    if (Component == null) {
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Component not found" />
    }

    return (
      <Suspense>
        <PropsValue element={elementData}>
          {props =>
            forwardRef ? (
              <Component {...props} key={elementData.key} ref={ref} />
            ) : (
              <Component {...props} key={elementData.key} />
            )
          }
        </PropsValue>
      </Suspense>
    )
  }),
)

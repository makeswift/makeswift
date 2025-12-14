import type { Component, PropsWithoutRef, RefAttributes } from 'react'
import { type ComponentType } from '../../../state/read-only-state'

type WrapperComponent = {
  $$typeof: string
  new (props: PropsWithoutRef<any> & RefAttributes<any>, context?: any): Component<any>
}

type MemoComponent = WrapperComponent & {
  type: ComponentType
}

// See https://github.com/facebook/react/blob/main/packages/shared/ReactSymbols.js
const REACT_MEMO_TYPE: symbol = Symbol.for('react.memo')
const REACT_LAZY_TYPE: symbol = Symbol.for('react.lazy')
const REACT_FORWARD_REF_TYPE: symbol = Symbol.for('react.forward_ref')

function hasTypeofSymbol(c: ComponentType, type: symbol): c is WrapperComponent {
  // React uses `$$typeof` field on its wrapper components to identify them,
  // see https://github.com/facebook/react/blob/main/packages/shared/ReactElementType.js
  // and https://github.com/search?q=repo%3Afacebook%2Freact%20%24%24typeof&type=code
  return c != null && '$$typeof' in c && c.$$typeof === type
}

function isMemoComponent(c: ComponentType): c is MemoComponent {
  return hasTypeofSymbol(c, REACT_MEMO_TYPE)
}

function isLazyComponent(c: ComponentType) {
  return hasTypeofSymbol(c, REACT_LAZY_TYPE)
}

function isForwardRef(c: ComponentType) {
  return hasTypeofSymbol(c, REACT_FORWARD_REF_TYPE)
}

function unwrapIfMemo(c: ComponentType): ComponentType {
  return isMemoComponent(c) ? c.type : c
}

function isClassComponent(c: ComponentType) {
  return typeof c === 'function' && c.prototype && Boolean(c.prototype.isReactComponent)
}

function canAcceptRefImpl(c: ComponentType) {
  return (
    isClassComponent(c) ||
    isForwardRef(c) ||
    // will try to pass a ref to all lazy components since we can't know if they accept refs without loading them
    isLazyComponent(c)
  )
}

export function canAcceptRef(c: ComponentType) {
  return canAcceptRefImpl(unwrapIfMemo(c))
}

import { ReactInstance, type Component } from 'react'
import ReactDOM from 'react-dom'

type findDOMNode = (instance: ReactInstance | null | undefined) => Element | null | Text

// https://github.com/facebook/react/blob/main/packages/shared/ReactDOMSharedInternals.js
const reactDOMInternals = (ReactDOM as any)
  .__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE as {
  findDOMNode: findDOMNode
}

export function findDOMNode(instance: Component | null | undefined): Element | Text | null {
  return (ReactDOM as typeof ReactDOM & { findDOMNode?: findDOMNode }).findDOMNode
    ? (ReactDOM as typeof ReactDOM & { findDOMNode: findDOMNode }).findDOMNode(instance)
    : reactDOMInternals.findDOMNode(instance)
}

import { type Component } from 'react'
import ReactDOM from 'react-dom'

// https://github.com/facebook/react/blob/main/packages/shared/ReactDOMSharedInternals.js
const reactDOMInternals = (ReactDOM as any)
  .__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE as {
  findDOMNode: typeof ReactDOM.findDOMNode
}

export function findDOMNode(instance: Component | null | undefined): Element | Text | null {
  return ReactDOM.findDOMNode
    ? ReactDOM.findDOMNode(instance)
    : reactDOMInternals.findDOMNode(instance)
}

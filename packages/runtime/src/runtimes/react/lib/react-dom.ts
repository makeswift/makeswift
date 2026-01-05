import { type Component } from 'react'
import ReactDOM from 'react-dom'

type FindDOMNodeFn = (instance: Component | null | undefined) => Element | Text | null

type ReactDOMWithLegacyFindDOMNode = typeof ReactDOM & { findDOMNode?: FindDOMNodeFn }

// For React 18 and below
const ReactDOMCompat = ReactDOM as ReactDOMWithLegacyFindDOMNode

// For React 19
// https://github.com/facebook/react/blob/main/packages/shared/ReactDOMSharedInternals.js
const reactDOMInternals = (ReactDOM as any)
  .__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE as {
  findDOMNode: FindDOMNodeFn
}

export function findDOMNode(instance: Component | null | undefined): Element | Text | null {
  return ReactDOMCompat.findDOMNode
    ? ReactDOMCompat.findDOMNode(instance)
    : reactDOMInternals.findDOMNode(instance)
}

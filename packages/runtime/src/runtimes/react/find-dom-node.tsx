import { ForwardedRef } from 'react'
import { ReactInstance } from 'react'
import { forwardRef } from 'react'
import { Component, ReactNode } from 'react'
import { findDOMNode } from 'react-dom'

type FindDomNodeClassComponentProps = {
  innerRef?: ForwardedRef<Element | Text | null>
  children?: ReactNode
}

/**
 * @see https://github.com/facebook/react/blob/a2505792ed17fd4d7ddc69561053c3ac90899491/packages/react-reconciler/src/ReactFiberReconciler.new.js#L179-L244
 */
function suppressWarningAndFindDomNode(
  instance: ReactInstance | null | undefined,
): Element | Text | null {
  const error = console.error

  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('%s is deprecated in StrictMode.')) return

    return error.apply(console, args)
  }

  const foundDomNode = findDOMNode(instance)

  console.error = error

  return foundDomNode
}

class FindDomNodeClassComponent extends Component<FindDomNodeClassComponentProps> {
  componentDidMount() {
    this.setInnerRef(suppressWarningAndFindDomNode(this))
  }

  componentDidUpdate() {
    this.setInnerRef(suppressWarningAndFindDomNode(this))
  }

  setInnerRef(current: Element | Text | null) {
    const { innerRef } = this.props

    if (innerRef == null) return

    if (typeof innerRef === 'function') innerRef(current)
    else innerRef.current = current
  }

  render() {
    return <>{this.props.children}</>
  }
}

type FindDomNodeProps = {
  children?: ReactNode
}

export const FindDomNode = forwardRef<Element | Text | null, FindDomNodeProps>(function FindDomNode(
  props,
  ref,
) {
  return <FindDomNodeClassComponent {...props} innerRef={ref} />
})

import { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { Component, ReactNode } from 'react'
import { findDOMNode } from 'react-dom'

type FindDomNodeClassComponentProps = {
  innerRef?: ForwardedRef<Element | Text | null>
  children?: ReactNode
}

class FindDomNodeClassComponent extends Component<FindDomNodeClassComponentProps> {
  componentDidMount() {
    this.setInnerRef(findDOMNode(this))
  }

  componentDidUpdate() {
    this.setInnerRef(findDOMNode(this))
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

import { ForwardedRef } from 'react'
import { ReactInstance } from 'react'
import { forwardRef } from 'react'
import { Component, ReactNode } from 'react'
import { findDOMNode } from 'react-dom'

type FindDomNodeClassComponentProps = {
  innerRef?: ForwardedRef<Element | Text | null>
  children?: ReactNode
}

function suppressWarningAndFindDomNode(
  instance: ReactInstance | null | undefined,
): Element | Text | null {
  const error = console.error

  console.error = (...args) => {
    const [msg, ...substitutions] = args
    const text = substitutions.reduce((text, substitution) => text.replace('%s', substitution), msg)

    if (!text.includes('findDOMNode is deprecated in StrictMode.')) {
      error.apply(console, args)
    }
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

import { Component, ElementType, ReactNode } from 'react'

type ErrorProps = {
  FallbackComponent: ElementType
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorProps, State> {
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  state = { hasError: false }

  render() {
    const { FallbackComponent } = this.props

    if (this.state.hasError) return FallbackComponent ? <FallbackComponent /> : null

    return this.props.children
  }
}

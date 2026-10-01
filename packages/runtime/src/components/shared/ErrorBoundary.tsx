import { Component, type ElementType, type ReactNode } from 'react'

type ErrorProps = {
  FallbackComponent: ElementType<{ details: string }>
  children: ReactNode
}

type State =
  | {
      hasError: false
    }
  | {
      hasError: true
      details: string
    }

export class ErrorBoundary extends Component<ErrorProps, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, details: error.message }
  }

  state: State = { hasError: false }

  render() {
    const { FallbackComponent } = this.props

    if (this.state.hasError)
      return FallbackComponent ? <FallbackComponent details={this.state.details} /> : null

    return this.props.children
  }
}

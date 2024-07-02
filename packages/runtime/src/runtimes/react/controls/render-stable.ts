import { isValidElement, ReactNode } from 'react'
import { objectsAreEqual } from '@makeswift/controls'

export function renderStable<P extends object>(
  render: (props: P) => ReactNode,
  previous?: ReactNode,
): (props: P) => ReactNode {
  return function (props: P): ReactNode {
    if (isValidElement(previous)) {
      if (objectsAreEqual(previous.props, props)) {
        return previous
      }
    } else {
      if (previous != null) {
        console.error('Expected `previous` to be a valid React element, got', previous)
      }
    }

    return render(props)
  }
}

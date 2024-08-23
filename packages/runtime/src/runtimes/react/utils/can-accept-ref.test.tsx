import { Component, forwardRef, memo, lazy } from 'react'

import { canAcceptRef } from './can-accept-ref'

class Greeting extends Component {
  render() {
    return <h1>Hello, world!</h1>
  }
}

describe('canAcceptRef', () => {
  test.each([
    [false, 'function component', () => <div />],
    [
      true,
      'function component wrapped in `forwardRef',
      forwardRef<HTMLDivElement>((_, ref) => <div ref={ref} />),
    ],
    [true, 'class component', Greeting],
    // we try to pass a ref to all lazy components since we can't know if they accept refs without loading them
    [true, 'lazy function component', lazy(async () => ({ default: () => <div /> }))],
    [true, 'lazy class component', lazy(async () => ({ default: Greeting }))],
  ])('returns %s for a %s', (expected, _, c) => {
    expect(canAcceptRef(c)).toBe(expected)
    expect(canAcceptRef(memo(c))).toBe(expected)
  })
})

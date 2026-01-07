/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import * as Testing from '../../../testing'

import {
  containerId,
  fallbackId,
  CustomComponentWithFallback,
  elementData,
  renderComponentSnapshot,
} from './fixtures'

describe('MakeswiftComponent (React 18)', () => {
  test('suspended component renders a null fallback', async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(
      elementData({ text: 'Hello World', suspend: true }),
    )
    await renderComponentSnapshot(snapshot)
    expect(screen.queryByTestId(containerId)).toBeEmptyDOMElement()
  })

  test("suspended component registered with 'builtinSuspense: false' renders its own fallback", async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(
      elementData({ text: 'Hello World', suspend: true }),
    )
    await renderComponentSnapshot(snapshot, CustomComponentWithFallback, {
      builtinSuspense: false,
    })
    expect(screen.queryByTestId(fallbackId)).toHaveTextContent('Loading...')
  })
})

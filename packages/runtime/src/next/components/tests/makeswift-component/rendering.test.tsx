/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import * as Testing from '../../../testing'

import {
  componentId,
  fallbackId,
  CustomComponentWithFallback,
  elementData,
  renderComponentSnapshot,
} from './fixtures'

describe('MakeswiftComponent', () => {
  test('empty snapshot renders component with default props', async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(null)
    await renderComponentSnapshot(snapshot)
    expect(screen.queryByTestId(componentId)).toHaveTextContent('Default Text')
  })

  test('existing snapshot renders component with saved props', async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(elementData({ text: 'Hello World' }))
    await renderComponentSnapshot(snapshot)
    expect(screen.queryByTestId(componentId)).toHaveTextContent('Hello World')
  })

  test('suspended component renders its own fallback', async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(
      elementData({ text: 'Hello World', suspend: true }),
    )
    await renderComponentSnapshot(snapshot, CustomComponentWithFallback)
    expect(screen.queryByTestId(fallbackId)).toHaveTextContent('Loading...')
  })
})

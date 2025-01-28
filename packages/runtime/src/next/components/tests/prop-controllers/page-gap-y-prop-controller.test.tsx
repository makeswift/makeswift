/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  GapY,
  GapYDescriptor,
  Types,
  createGapYPropControllerDataFromResponsiveGapData,
  ResponsiveGapData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import * as Testing from '../../../../runtimes/react/testing'

describe('Page', () => {
  test('can render GapYPropController v0 data', async () => {
    // Arrange
    const gapYDefinitionV0: GapYDescriptor = {
      type: Types.GapY,
      options: {},
    }
    const gapData: ResponsiveGapData = [
      {
        deviceId: 'desktop',
        value: { value: 17, unit: 'px' },
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          gapY: createGapYPropControllerDataFromResponsiveGapData(gapData, gapYDefinitionV0),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { gapY?: ResponsiveGapData }>(({ gapY }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {gapY?.at(0)?.value.value}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          gapY: GapY(),
        },
      },
    )

    await act(async () =>
      render(
        <Testing.ReactProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </Testing.ReactProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent('17')
  })

  test('can render GapYPropController v1 data', async () => {
    // Arrange
    const gapYDefinitionV1: GapYDescriptor = {
      type: Types.GapY,
      version: 1,
      options: {},
    }
    const gapData: ResponsiveGapData = [
      {
        deviceId: 'desktop',
        value: { value: 17, unit: 'px' },
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          gapY: createGapYPropControllerDataFromResponsiveGapData(gapData, gapYDefinitionV1),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { gapY?: ResponsiveGapData }>(({ gapY }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {gapY?.at(0)?.value.value}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          gapY: GapY(),
        },
      },
    )

    await act(async () =>
      render(
        <Testing.ReactProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </Testing.ReactProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent('17')
  })
})

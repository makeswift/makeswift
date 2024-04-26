/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  GapX,
  GapXDescriptor,
  Types,
  createGapXPropControllerDataFromResponsiveGapData,
  ResponsiveGapData,
} from '@makeswift/prop-controllers'
import { Page } from '../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntimeProvider } from '../../context/react-runtime'
import { ReactRuntime } from '../../../react'
import { forwardRef } from 'react'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../utils/tests/element-data-test-test'

describe('Page', () => {
  test('can render GapXPropController v0 data', async () => {
    // Arrange
    const gapXDefinitionV0: GapXDescriptor = {
      type: Types.GapX,
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
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          gapX: createGapXPropControllerDataFromResponsiveGapData(gapData, gapXDefinitionV0),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { gapX?: ResponsiveGapData }>(({ gapX }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {gapX?.at(0)?.value.value}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          gapX: GapX(),
        },
      },
    )

    await act(async () =>
      render(
        <ReactRuntimeProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </ReactRuntimeProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent('17')
  })

  test('can render GapXPropController v1 data', async () => {
    // Arrange
    const gapXDefinitionV1: GapXDescriptor = {
      type: Types.GapX,
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
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          gapX: createGapXPropControllerDataFromResponsiveGapData(gapData, gapXDefinitionV1),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { gapX?: ResponsiveGapData }>(({ gapX }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {gapX?.at(0)?.value.value}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          gapX: GapX(),
        },
      },
    )

    await act(async () =>
      render(
        <ReactRuntimeProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </ReactRuntimeProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent('17')
  })
})

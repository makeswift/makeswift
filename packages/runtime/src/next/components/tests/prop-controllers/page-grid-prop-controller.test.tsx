/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Grid,
  GridDescriptor,
  Types,
  createGridPropControllerDataFromGridData,
  GridData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import * as Testing from '../../../../runtimes/react/testing'

describe('Page', () => {
  test('can render GridPropController v0 data', async () => {
    // Arrange
    const gridDefinitionV0: GridDescriptor = {
      type: Types.Grid,
      options: {},
    }
    const gridData: GridData = {
      elements: [
        {
          key: 'element1',
          type: 'element1',
          props: {},
        },
      ],
      columns: [],
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          grid: createGridPropControllerDataFromGridData(gridData, gridDefinitionV0),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { grid?: GridData }>(({ grid }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {grid?.elements.at(0)?.key}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          grid: Grid(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('element1')
  })

  test('can render GridPropController v1 data', async () => {
    // Arrange
    const gridDefinitionV1: GridDescriptor = {
      type: Types.Grid,
      version: 1,
      options: {},
    }
    const gridData: GridData = {
      elements: [
        {
          key: 'element1',
          type: 'element1',
          props: {},
        },
      ],
      columns: [],
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          grid: createGridPropControllerDataFromGridData(gridData, gridDefinitionV1),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { grid?: GridData }>(({ grid }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {grid?.elements.at(0)?.key}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          grid: Grid(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('element1')
  })
})

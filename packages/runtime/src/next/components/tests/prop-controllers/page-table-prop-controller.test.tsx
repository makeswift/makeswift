/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Table,
  TableDescriptor,
  Types,
  createTablePropControllerDataFromTableId,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntimeProvider } from '../../../../runtimes/react'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../utils/tests/element-data-test-test'

describe('Page', () => {
  test('can render TablePropController v0 data', async () => {
    // Arrange
    const tableDefinitionV0: TableDescriptor = {
      type: Types.Table,
      options: {},
    }
    const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          table: createTablePropControllerDataFromTableId(tableId, tableDefinitionV0),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { table?: string }>(({ table }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {table}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          table: Table(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(tableId)
  })

  test('can render TablePropController v1 data', async () => {
    // Arrange
    const tableDefinitionV1: TableDescriptor = {
      type: Types.Table,
      version: 1,
      options: {},
    }
    const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          table: createTablePropControllerDataFromTableId(tableId, tableDefinitionV1),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { table?: string }>(({ table }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {table}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          table: Table(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(tableId)
  })
})

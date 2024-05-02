/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../state/react-page'
import { randomUUID } from 'crypto'
import { Page } from '../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntimeProvider } from '../../context/react-runtime'
import { ReactRuntime } from '../../../react'
import { forwardRef } from 'react'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../utils/tests/element-data-test-test'
import {
  Slot,
  SlotControlDefinition,
  SlotControlType,
  SlotData,
  createSlotControlDataFromSlotData,
} from '../../../controls'
import { SlotControlValue } from '../../../runtimes/react/controls/slot'

describe('Page', () => {
  test('can render SlotControl v0 data', async () => {
    // Arrange
    const slotDefinitionV0: SlotControlDefinition = {
      type: SlotControlType,
    }
    const slotData: SlotData = {
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
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          slot: createSlotControlDataFromSlotData(slotData, slotDefinitionV0),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { slot?: SlotControlValue }>(({ slot }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {slot?.elements.at(0)?.key}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          slot: Slot(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('element1')
  })

  test('can render SlotControl v1 data', async () => {
    // Arrange
    const slotDefinitionV1: SlotControlDefinition = {
      type: SlotControlType,
      version: 1,
    }
    const slotData: SlotData = {
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
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          slot: createSlotControlDataFromSlotData(slotData, slotDefinitionV1),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { slot?: SlotControlValue }>(({ slot }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {slot?.elements.at(0)?.key}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          slot: Slot(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('element1')
  })
})

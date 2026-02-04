/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/read-only-state'
import { randomUUID } from 'crypto'
import {
  Date as DatePropController,
  DateDescriptor,
  Types,
  createDatePropControllerDataFromString,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { forwardRef, act } from 'react'
import * as Testing from '../../../testing'

describe('Page', () => {
  test('can render DatePropController v0 data', async () => {
    // Arrange
    const dateDefinitionV0: DateDescriptor = {
      type: Types.Date,
      options: {},
    }
    const dateData = new Date().toISOString()
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          date: createDatePropControllerDataFromString(dateData, dateDefinitionV0),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = Testing.createReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { date?: string }>(({ date }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {date}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          date: DatePropController(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(dateData)
  })

  test('can render DatePropController v1 data', async () => {
    // Arrange
    const dateDefinitionV1: DateDescriptor = {
      type: Types.Date,
      version: 1,
      options: {},
    }
    const dateData = new Date().toISOString()
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          date: createDatePropControllerDataFromString(dateData, dateDefinitionV1),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = Testing.createReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { date?: string }>(({ date }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {date}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          date: DatePropController(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(dateData)
  })
})

/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  ElementID,
  ElementIDDescriptor,
  Types,
  createElementIDPropControllerDataFromElementID,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import * as Testing from '../../../testing'

describe('Page', () => {
  test('can render ElementIDPropController v0 data', async () => {
    // Arrange
    const elementIDDefinitionV0: ElementIDDescriptor = {
      type: Types.ElementID,
      options: {},
    }
    const elementID = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          elementID: createElementIDPropControllerDataFromElementID(
            elementID,
            elementIDDefinitionV0,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { elementID?: string }>(({ elementID }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {elementID}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          elementID: ElementID(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(elementID)
  })

  test('can render ElementIDPropController v1 data', async () => {
    // Arrange
    const elementIDDefinitionV1: ElementIDDescriptor = {
      type: Types.ElementID,
      version: 1,
      options: {},
    }
    const elementID = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          elementID: createElementIDPropControllerDataFromElementID(
            elementID,
            elementIDDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { elementID?: string }>(({ elementID }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {elementID}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          elementID: ElementID(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(elementID)
  })
})

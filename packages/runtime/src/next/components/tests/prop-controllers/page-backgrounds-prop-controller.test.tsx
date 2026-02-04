/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/read-only-state'
import { randomUUID } from 'crypto'
import {
  Backgrounds,
  BackgroundsDescriptor,
  Types,
  createBackgroundsPropControllerDataFromResponsiveBackgroundsData,
  ResponsiveBackgroundsData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import * as Testing from '../../../testing'
import { forwardRef, act } from 'react'

describe('Page', () => {
  test('can render BackgroundsPropController v1 data', async () => {
    // Arrange
    const backgroundsDefinitionV1: BackgroundsDescriptor = {
      type: Types.Backgrounds,
      version: 1,
      options: {},
    }
    const itemId = 'itemId'
    const responsiveBackgroundsData: ResponsiveBackgroundsData = [
      {
        deviceId: 'desktop',
        value: [
          {
            type: 'color',
            id: itemId,
            payload: null,
          },
        ],
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          backgrounds: createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
            responsiveBackgroundsData,
            backgroundsDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = Testing.createReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { backgrounds?: ResponsiveBackgroundsData }>(
        ({ backgrounds }, ref) => {
          return (
            <div ref={ref} data-testid={testId}>
              {backgrounds?.at(0)?.value.at(0)?.id}
            </div>
          )
        },
      ),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          backgrounds: Backgrounds(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(itemId)
  })

  test('can render BackgroundsPropController v2 data', async () => {
    // Arrange
    const backgroundsDefinitionV2: BackgroundsDescriptor = {
      type: Types.Backgrounds,
      version: 2,
      options: {},
    }
    const itemId = 'itemId'
    const responsiveBackgroundsData: ResponsiveBackgroundsData = [
      {
        deviceId: 'desktop',
        value: [
          {
            type: 'color',
            id: itemId,
            payload: null,
          },
        ],
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          backgrounds: createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
            responsiveBackgroundsData,
            backgroundsDefinitionV2,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = Testing.createReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { backgrounds?: ResponsiveBackgroundsData }>(
        ({ backgrounds }, ref) => {
          return (
            <div ref={ref} data-testid={testId}>
              {backgrounds?.at(0)?.value.at(0)?.id}
            </div>
          )
        },
      ),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          backgrounds: Backgrounds(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(itemId)
  })
})

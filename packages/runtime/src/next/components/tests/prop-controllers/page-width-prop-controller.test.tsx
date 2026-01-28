/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/read-only-state'
import { randomUUID } from 'crypto'
import {
  Width,
  WidthDescriptor,
  ResponsiveLengthData,
  Types,
  createWidthPropControllerDataFromResponsiveLengthData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { ReactRuntime } from '../../../../react'
import { forwardRef, act } from 'react';
import * as Testing from '../../../testing'

describe('Page', () => {
  test('can render WidthPropController v0 data', async () => {
    // Arrange
    const widthDefinitionV0: WidthDescriptor = {
      type: Types.Width,
      options: {},
    }
    const widthData: ResponsiveLengthData = [
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
          width: createWidthPropControllerDataFromResponsiveLengthData(
            widthData,
            widthDefinitionV0,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { width?: string }>(({ width }, ref) => {
        return <div className={width} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          width: Width({ format: Width.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('width', '17px', {
      media: Testing.DESKTOP_MEDIA_QUERY,
    })
  })

  test('can render WidthPropController v1 data', async () => {
    // Arrange
    const widthDefinitionV1: WidthDescriptor = {
      type: Types.Width,
      version: 1,
      options: {},
    }
    const widthData: ResponsiveLengthData = [
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
          width: createWidthPropControllerDataFromResponsiveLengthData(
            widthData,
            widthDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { width?: string }>(({ width }, ref) => {
        return <div className={width} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          width: Width({ format: Width.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('width', '17px', {
      media: Testing.DESKTOP_MEDIA_QUERY,
    })
  })
})

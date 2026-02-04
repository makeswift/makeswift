/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/read-only-state'
import { randomUUID } from 'crypto'
import {
  Padding,
  PaddingDescriptor,
  ResponsivePaddingData,
  Types,
  createPaddingPropControllerDataFromResponsivePaddingData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { forwardRef, act } from 'react'
import * as Testing from '../../../testing'

describe('Page', () => {
  test('can render PaddingPropController v0 data', async () => {
    // Arrange
    const paddingDefinitionV0: PaddingDescriptor = {
      type: Types.Padding,
      options: {},
    }
    const paddingData: ResponsivePaddingData = [
      {
        deviceId: 'desktop',
        value: {
          paddingTop: { value: 17, unit: 'px' },
          paddingRight: null,
          paddingBottom: null,
          paddingLeft: null,
        },
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          padding: createPaddingPropControllerDataFromResponsivePaddingData(
            paddingData,
            paddingDefinitionV0,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = Testing.createReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { padding?: string }>(({ padding }, ref) => {
        return <div className={padding} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          padding: Padding({ format: Padding.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('padding-top', '17px', {
      media: Testing.DESKTOP_MEDIA_QUERY,
    })
  })

  test('can render PaddingPropController v1 data', async () => {
    // Arrange
    const paddingDefinitionV1: PaddingDescriptor = {
      type: Types.Padding,
      version: 1,
      options: {},
    }
    const paddingData: ResponsivePaddingData = [
      {
        deviceId: 'desktop',
        value: {
          paddingTop: { value: 17, unit: 'px' },
          paddingRight: null,
          paddingBottom: null,
          paddingLeft: null,
        },
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          padding: createPaddingPropControllerDataFromResponsivePaddingData(
            paddingData,
            paddingDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = Testing.createReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { padding?: string }>(({ padding }, ref) => {
        return <div className={padding} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          padding: Padding({ format: Padding.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('padding-top', '17px', {
      media: Testing.DESKTOP_MEDIA_QUERY,
    })
  })
})

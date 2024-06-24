/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Margin,
  MarginDescriptor,
  ResponsiveMarginData,
  Types,
  createMarginPropControllerDataFromResponsiveMarginData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntimeProvider } from '../../../context/react-runtime'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../utils/tests/element-data-test-test'
import { DESKTOP_MEDIA_QUERY } from '../../../../utils/tests/breakpoint-test-util'

describe('Page', () => {
  test('can render MarginPropController v0 data', async () => {
    // Arrange
    const marginDefinitionV0: MarginDescriptor = {
      type: Types.Margin,
      options: {},
    }
    const marginData: ResponsiveMarginData = [
      {
        deviceId: 'desktop',
        value: {
          marginTop: 'auto',
          marginRight: null,
          marginBottom: null,
          marginLeft: null,
        },
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          margin: createMarginPropControllerDataFromResponsiveMarginData(
            marginData,
            marginDefinitionV0,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { margin?: string }>(({ margin }, ref) => {
        return <div className={margin} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          margin: Margin({ format: Margin.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('margin-top', 'auto', {
      media: DESKTOP_MEDIA_QUERY,
    })
  })

  test('can render MarginPropController v1 data', async () => {
    // Arrange
    const marginDefinitionV1: MarginDescriptor = {
      type: Types.Margin,
      version: 1,
      options: {},
    }
    const marginData: ResponsiveMarginData = [
      {
        deviceId: 'desktop',
        value: {
          marginTop: 'auto',
          marginRight: null,
          marginBottom: null,
          marginLeft: null,
        },
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          margin: createMarginPropControllerDataFromResponsiveMarginData(
            marginData,
            marginDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { margin?: string }>(({ margin }, ref) => {
        return <div className={margin} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          margin: Margin({ format: Margin.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('margin-top', 'auto', {
      media: DESKTOP_MEDIA_QUERY,
    })
  })
})

/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  TextStyle,
  TextStyleDescriptor,
  Types,
  createTextStylePropControllerDataFromResponsiveTextStyleData,
  ResponsiveTextStyleData,
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
  test('can render TextStylePropController v0 data', async () => {
    // Arrange
    const textStyleDefinitionV0: TextStyleDescriptor = {
      type: Types.TextStyle,
      options: {},
    }
    const textStyleData: ResponsiveTextStyleData = [
      {
        deviceId: 'desktop',
        value: {
          fontFamily: 'Times New Roman',
          letterSpacing: null,
          fontSize: null,
          fontWeight: null,
          textTransform: [],
          fontStyle: [],
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
          textStyle: createTextStylePropControllerDataFromResponsiveTextStyleData(
            textStyleData,
            textStyleDefinitionV0,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { textStyle?: ResponsiveTextStyleData }>(({ textStyle }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {textStyle?.at(0)?.value.fontFamily}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          textStyle: TextStyle(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('Times New Roman')
  })

  test('can render TextStylePropController v1 data', async () => {
    // Arrange
    const textStyleDefinitionV1: TextStyleDescriptor = {
      type: Types.TextStyle,
      version: 1,
      options: {},
    }
    const textStyleData: ResponsiveTextStyleData = [
      {
        deviceId: 'desktop',
        value: {
          fontFamily: 'Times New Roman',
          letterSpacing: null,
          fontSize: null,
          fontWeight: null,
          textTransform: [],
          fontStyle: [],
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
          textStyle: createTextStylePropControllerDataFromResponsiveTextStyleData(
            textStyleData,
            textStyleDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { textStyle?: ResponsiveTextStyleData }>(({ textStyle }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {textStyle?.at(0)?.value?.fontFamily}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          textStyle: TextStyle(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('Times New Roman')
  })
})

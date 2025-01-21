/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Font,
  FontDescriptor,
  Types,
  createFontPropControllerDataFromResponsiveFontData,
  ResponsiveFontData,
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
  test('can render FontPropController v0 data', async () => {
    // Arrange
    const fontDefinitionV0: FontDescriptor = {
      type: Types.Font,
      options: {},
    }
    const fontData: ResponsiveFontData = [
      {
        deviceId: 'desktop',
        value: 'Times New Roman',
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          font: createFontPropControllerDataFromResponsiveFontData(fontData, fontDefinitionV0),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { font?: ResponsiveFontData }>(({ font }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {font?.at(0)?.value}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          font: Font(),
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

  test('can render FontPropController v1 data', async () => {
    // Arrange
    const fontDefinitionV1: FontDescriptor = {
      type: Types.Font,
      version: 1,
      options: {},
    }
    const fontData: ResponsiveFontData = [
      {
        deviceId: 'desktop',
        value: 'Times New Roman',
      },
    ]
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          font: createFontPropControllerDataFromResponsiveFontData(fontData, fontDefinitionV1),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { font?: ResponsiveFontData }>(({ font }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {font?.at(0)?.value}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          font: Font(),
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

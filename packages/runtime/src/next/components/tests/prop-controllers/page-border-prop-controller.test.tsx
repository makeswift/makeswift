/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Border,
  BorderDescriptor,
  ResponsiveBorderData,
  Types,
  createBorderPropControllerDataFromResponsiveBorderData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import * as Testing from '../../../../runtimes/react/testing'

describe('Page', () => {
  test('can render BorderPropController v0 data', async () => {
    // Arrange
    const borderDefinitionV0: BorderDescriptor = {
      type: Types.Border,
      options: {},
    }
    const borderData: ResponsiveBorderData = [
      {
        deviceId: 'desktop',
        value: {
          borderTop: {
            width: 1,
            style: 'solid',
          },
          borderRight: null,
          borderBottom: null,
          borderLeft: null,
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
          border: createBorderPropControllerDataFromResponsiveBorderData(
            borderDefinitionV0,
            borderData,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { border?: string }>(({ border }, ref) => {
        return <div className={border} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          border: Border({ format: Border.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('border-top', '1px solid black', {
      media: Testing.DESKTOP_MEDIA_QUERY,
    })
  })

  test('can render BorderPropController v1 data', async () => {
    // Arrange
    const borderDefinitionV1: BorderDescriptor = {
      type: Types.Border,
      version: 1,
      options: {},
    }
    const borderData: ResponsiveBorderData = [
      {
        deviceId: 'desktop',
        value: {
          borderTop: {
            width: 1,
            style: 'solid',
          },
          borderRight: null,
          borderBottom: null,
          borderLeft: null,
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
          border: createBorderPropControllerDataFromResponsiveBorderData(
            borderDefinitionV1,
            borderData,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { border?: string }>(({ border }, ref) => {
        return <div className={border} ref={ref} data-testid={testId} />
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          border: Border({ format: Border.Format.ClassName }),
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

    expect(screen.getByTestId(testId)).toHaveStyleRule('border-top', '1px solid black', {
      media: Testing.DESKTOP_MEDIA_QUERY,
    })
  })
})

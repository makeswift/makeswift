/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntimeProvider } from '../../../context/react-runtime'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../utils/tests/element-data-test-test'
import {
  Checkbox,
  CheckboxControlData,
  CheckboxControlDataTypeKey,
  CheckboxControlDataTypeValueV1,
  CheckboxControlDataV0,
  CheckboxControlDataV1,
} from '@makeswift/controls'

const ROOT_ID = '00000000-0000-0000-0000-000000000000'
const ELEMENT_ID = '11111111-1111-1111-1111-111111111111'

describe('Page', () => {
  test.each([true, false])('can render CheckboxControl v0 data', async bool => {
    // Arrange
    const checkboxControlData: CheckboxControlDataV0 = bool
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent(
      [
        {
          key: ELEMENT_ID,
          type: TestComponentType,
          props: {
            checkbox: checkboxControlData,
          },
        },
      ],
      ROOT_ID,
    )
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    // Act
    runtime.registerComponent(
      forwardRef<HTMLDivElement, { checkbox?: CheckboxControlData }>(({ checkbox }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {JSON.stringify(checkbox)}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          checkbox: Checkbox(),
        },
      },
    )

    // Assert
    await act(async () =>
      render(
        <ReactRuntimeProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </ReactRuntimeProvider>,
      ),
    )

    expect(snapshot).toMatchSnapshot()
    expect(JSON.parse(screen.getByTestId(testId).textContent ?? '')).toBe(bool)
  })

  test.each([true, false])('can render CheckboxControl v1 data', async bool => {
    // Arrange
    const checkboxControlData: CheckboxControlDataV1 = {
      [CheckboxControlDataTypeKey]: CheckboxControlDataTypeValueV1,
      value: bool,
    }

    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent(
      [
        {
          key: ELEMENT_ID,
          type: TestComponentType,
          props: {
            checkbox: checkboxControlData,
          },
        },
      ],
      ROOT_ID,
    )
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    // Act
    runtime.registerComponent(
      forwardRef<HTMLDivElement, { checkbox?: CheckboxControlData }>(({ checkbox }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {JSON.stringify(checkbox)}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          checkbox: Checkbox(),
        },
      },
    )

    // Assert
    await act(async () =>
      render(
        <ReactRuntimeProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </ReactRuntimeProvider>,
      ),
    )

    expect(snapshot).toMatchSnapshot()
    expect(JSON.parse(screen.getByTestId(testId).textContent ?? '')).toBe(bool)
  })
})

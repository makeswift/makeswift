/** @jest-environment jsdom */

import { forwardRef, useRef } from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Data } from '@makeswift/controls'

import { ElementData } from '../../../../state/react-page'
import { Page } from '../../page'
import { ReactRuntimeProvider } from '../../../context/react-runtime'
import { ReactRuntime } from '../../../../react'

import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../utils/tests/element-data-test-test'

import { type MakeswiftPageSnapshot } from '../../../../next'
import { ControlDefinition, ControlDefinitionData } from '../../../../controls'

const ROOT_ID = '00000000-0000-0000-0000-000000000000'
const ELEMENT_ID = '11111111-1111-1111-1111-111111111111'

export async function testPageControlPropRendering<T extends ControlDefinition>(
  controlDefinition: T,
  {
    toData,
    value,
    cacheData,
    expectedRenders,
  }: {
    toData: (value: Data) => ControlDefinitionData<T>
    value: Data
    cacheData?: MakeswiftPageSnapshot['cacheData']
    expectedRenders?: number
  },
) {
  // Arrange
  const controlData = toData(value)
  const TestComponentType = 'TestComponent'
  const testId = 'test-id'
  const renderCountTestId = 'render-count-test-id'
  const elementData: ElementData = createRootComponent(
    [
      {
        key: ELEMENT_ID,
        type: TestComponentType,
        props: {
          propKey: controlData,
        },
      },
    ],
    ROOT_ID,
  )
  const snapshot = createMakeswiftPageSnapshot(elementData, {}, cacheData)
  const runtime = new ReactRuntime()

  // Act
  runtime.registerComponent(
    forwardRef<HTMLDivElement, { propKey?: any }>(({ propKey }, ref) => {
      const renderCount = useRef(0)
      ++renderCount.current
      return (
        <div ref={ref}>
          <div data-testid={renderCountTestId}>{renderCount.current}</div>
          <div data-testid={testId}>{JSON.stringify(propKey)}</div>
        </div>
      )
    }),
    {
      type: TestComponentType,
      label: 'TestComponent',
      props: {
        propKey: controlDefinition,
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

  expect(snapshot).toMatchSnapshot('snapshot')
  expect(JSON.parse(screen.getByTestId(testId).textContent ?? '')).toMatchSnapshot('resolvedValue')

  if (expectedRenders != null) {
    expect(Number(screen.getByTestId(renderCountTestId).textContent)).toBe(expectedRenders)
  }
}

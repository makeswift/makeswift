/** @jest-environment jsdom */

import { forwardRef, useRef, isValidElement } from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { type Data, type ValueType, type DataType, ControlDefinition } from '@makeswift/controls'

import { ElementData } from '../../../../state/react-page'
import { Page } from '../../page'
import { ReactRuntimeProvider } from '../../../context/react-runtime'
import { ReactRuntime } from '../../../../react'

import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../utils/tests/element-data-test-test'

import { type MakeswiftPageSnapshot } from '../../../../next'

const ROOT_ID = '00000000-0000-0000-0000-000000000000'
const ELEMENT_ID = '11111111-1111-1111-1111-111111111111'

const renderProp = (prop: any) =>
  prop === undefined ? 'undefined' : isValidElement(prop) ? prop : JSON.stringify(prop)

const propSnapshot = (prop: HTMLElement) =>
  prop.childElementCount ? prop.childNodes : parseStringifiedProp(prop.textContent ?? '')

const parseStringifiedProp = (prop: string) => (prop === 'undefined' ? undefined : JSON.parse(prop))

export async function testPageControlPropRendering<D extends ControlDefinition>(
  controlDefinition: D,
  {
    toData,
    value,
    cacheData,
    expectedRenders,
    registerComponents,
    action,
    rootElements = [],
  }: {
    toData?: (value: ValueType<D>) => DataType<D>
    value: ValueType<D> | undefined
    cacheData?: MakeswiftPageSnapshot['cacheData']
    expectedRenders?: number
    registerComponents?: (runtime: ReactRuntime) => void
    action?: (element: HTMLElement) => Promise<void>
    rootElements?: ElementData[]
  },
) {
  // Arrange
  const controlData: DataType<D> | Data =
    value !== undefined ? (toData ? toData(value) : controlDefinition.toData(value)) : undefined

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
      ...rootElements,
    ],
    ROOT_ID,
  )
  const snapshot = createMakeswiftPageSnapshot(elementData, {}, cacheData)
  const runtime = new ReactRuntime()
  registerComponents?.(runtime)

  // Act
  runtime.registerComponent(
    forwardRef<HTMLDivElement, { propKey?: any }>(({ propKey }, ref) => {
      const renderCount = useRef(0)
      ++renderCount.current

      return (
        <div ref={ref}>
          <div data-testid={renderCountTestId}>{renderCount.current}</div>
          <div data-testid={testId}>{renderProp(propKey)}</div>
        </div>
      )
    }),
    {
      type: TestComponentType,
      label: 'TestComponent',
      props: {
        propKey: controlDefinition as any,
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

  if (action) {
    await act(async () => {
      await action(screen.getByTestId(testId))
    })
  }

  expect(snapshot).toMatchSnapshot('snapshot')
  expect(propSnapshot(screen.getByTestId(testId))).toMatchSnapshot('resolvedValue')

  if (expectedRenders != null) {
    expect(Number(screen.getByTestId(renderCountTestId).textContent)).toBe(expectedRenders)
  }
}

/** @jest-environment jsdom */

import { forwardRef, useRef } from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  type ValueType,
  type ControlDataType,
  ControlTraits,
  ControlDefinitionType,
} from '@makeswift/controls'

import { ElementData } from '../../../../state/react-page'
import { Page } from '../../page'
import { ReactRuntimeProvider } from '../../../context/react-runtime'
import { ReactRuntime } from '../../../../react'
import { MakeswiftHostApiClient } from '../../../../api/react'

import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../utils/tests/element-data-test-test'

import { type MakeswiftPageSnapshot } from '../../../../next'

const ROOT_ID = '00000000-0000-0000-0000-000000000000'
const ELEMENT_ID = '11111111-1111-1111-1111-111111111111'

export async function testPageControlPropRendering<T extends ControlTraits>(
  traits: T,
  controlDefinition: ControlDefinitionType<T>,
  {
    toData,
    value,
    cacheData,
    expectedRenders,
  }: {
    toData: (value: ValueType<T>) => ControlDataType<T> | ValueType<T>
    value: ValueType<T>
    cacheData?: MakeswiftPageSnapshot['cacheData']
    expectedRenders?: number
  },
) {
  // Arrange
  const controlData: ControlDataType<T> = toData(value)
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

  const client = new MakeswiftHostApiClient({
    uri: snapshot.apiOrigin,
    cacheData: snapshot.cacheData,
    localizedResourcesMap: snapshot.localizedResourcesMap,
    locale: snapshot.locale ? new Intl.Locale(snapshot.locale) : undefined,
  })

  // Act
  runtime.registerComponent(
    forwardRef<HTMLDivElement, { propKey?: ValueType<T> }>(({ propKey }, ref) => {
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

  const resolvedValue = await traits.resolveValue(value, controlDefinition, client)
  expect(resolvedValue).toMatchSnapshot('resolvedValue')
  expect(snapshot).toMatchSnapshot('snapshot')
  expect(JSON.parse(screen.getByTestId(testId).textContent ?? '')).toBe(resolvedValue)

  if (expectedRenders != null) {
    expect(Number(screen.getByTestId(renderCountTestId).textContent)).toBe(expectedRenders)
  }
}

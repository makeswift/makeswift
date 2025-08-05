/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  TextInput,
  TextInputDescriptor,
  Types,
  createTextInputPropControllerDataFromString,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import * as Testing from '../../../testing'

describe('Page', () => {
  test('can render TextInputPropController v0 data', async () => {
    // Arrange
    const textInputDefinitionV0: TextInputDescriptor = {
      type: Types.TextInput,
      options: {},
    }
    const text = 'test text'
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          textInput: createTextInputPropControllerDataFromString(text, textInputDefinitionV0),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { textInput?: string }>(({ textInput }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {textInput}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          textInput: TextInput(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(text)
  })

  test('can render TextInputPropController v1 data', async () => {
    // Arrange
    const textInputDefinitionV1: TextInputDescriptor = {
      type: Types.TextInput,
      version: 1,
      options: {},
    }
    const text = 'test text'
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          textInput: createTextInputPropControllerDataFromString(text, textInputDefinitionV1),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { textInput?: String }>(({ textInput }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {textInput}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          textInput: TextInput(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(text)
  })
})

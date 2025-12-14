/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/read-only-state'
import { randomUUID } from 'crypto'
import {
  TextArea,
  TextAreaDescriptor,
  Types,
  createTextAreaPropControllerDataFromString,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { ReactRuntime } from '../../../../react'
import { forwardRef, act } from 'react';
import * as Testing from '../../../testing'

describe('Page', () => {
  test('can render TextAreaPropController v0 data', async () => {
    // Arrange
    const textAreaDefinitionV0: TextAreaDescriptor = {
      type: Types.TextArea,
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
          textArea: createTextAreaPropControllerDataFromString(text, textAreaDefinitionV0),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { textArea?: string }>(({ textArea }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {textArea}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          textArea: TextArea(),
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

  test('can render TextAreaPropController v1 data', async () => {
    // Arrange
    const textAreaDefinitionV1: TextAreaDescriptor = {
      type: Types.TextArea,
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
          textArea: createTextAreaPropControllerDataFromString(text, textAreaDefinitionV1),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { textArea?: String }>(({ textArea }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {textArea}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          textArea: TextArea(),
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

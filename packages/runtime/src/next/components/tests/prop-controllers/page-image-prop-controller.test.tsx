/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Image,
  ImageDescriptor,
  Types,
  createImagePropControllerDataFromImageData,
  ImageData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import * as Testing from '../../../../runtimes/react/testing'

describe('Page', () => {
  test('can render ImagePropController v0 data', async () => {
    // Arrange
    const imageDefinitionV0: ImageDescriptor = {
      type: Types.Image,
      options: {},
    }
    const imageData: ImageData = 'fileId'
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          image: createImagePropControllerDataFromImageData(imageData, imageDefinitionV0),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { image?: ImageData }>(({ image }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {typeof image === 'string'
              ? image
              : image?.type === 'makeswift-file'
                ? image.id
                : image?.url}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          image: Image(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(imageData)
  })

  test('can render ImagePropController v1 data', async () => {
    // Arrange
    const imageDefinitionV1: ImageDescriptor = {
      type: Types.Image,
      version: 1,
      options: {},
    }
    const fileId = 'fileId'
    const imageData: ImageData = {
      version: 1,
      type: 'makeswift-file',
      id: fileId,
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          image: createImagePropControllerDataFromImageData(imageData, imageDefinitionV1),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { image?: ImageData }>(({ image }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {typeof image === 'string'
              ? image
              : image?.type === 'makeswift-file'
                ? image.id
                : image?.url}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          image: Image(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(fileId)
  })

  test('can render ImagePropController v2 data', async () => {
    // Arrange
    const imageDefinitionV2: ImageDescriptor = {
      type: Types.Image,
      version: 2,
      options: {},
    }
    const fileId = 'fileId'
    const imageData: ImageData = {
      version: 1,
      type: 'makeswift-file',
      id: fileId,
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          image: createImagePropControllerDataFromImageData(imageData, imageDefinitionV2),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { image?: ImageData }>(({ image }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {typeof image === 'string'
              ? image
              : image?.type === 'makeswift-file'
                ? image.id
                : image?.url}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          image: Image(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(fileId)
  })
})

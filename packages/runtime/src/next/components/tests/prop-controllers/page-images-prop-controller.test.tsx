/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Images,
  ImagesDescriptor,
  Types,
  createImagesPropControllerDataFromImagesData,
  ImagesData,
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
import { ImagesDataV0 } from '@makeswift/prop-controllers/dist/types/images'

describe('Page', () => {
  test('can render ImagesPropController v0 data', async () => {
    // Arrange
    const imagesDefinitionV0: ImagesDescriptor = {
      type: Types.Images,
      options: {},
    }
    const fileId = 'fileId'
    const imagesData: ImagesDataV0 = [
      {
        key: 'key',
        props: {
          file: fileId,
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
          images: createImagesPropControllerDataFromImagesData(imagesData, imagesDefinitionV0),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { images?: ImagesData }>(({ images }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {images?.map(image => {
              const file = image.props.file

              return typeof file === 'string'
                ? file
                : file?.type === 'makeswift-file'
                  ? file.id
                  : file?.url
            })}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          images: Images(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(fileId)
  })

  test('can render ImagesPropController v1 data', async () => {
    // Arrange
    const imagesDefinitionV1: ImagesDescriptor = {
      type: Types.Images,
      version: 1,
      options: {},
    }
    const fileId = 'fileId'
    const imagesData: ImagesData = [
      {
        key: 'key',
        version: 1,
        props: {
          file: {
            version: 1,
            type: 'makeswift-file',
            id: fileId,
          },
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
          images: createImagesPropControllerDataFromImagesData(imagesData, imagesDefinitionV1),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { images?: ImagesData }>(({ images }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {images?.map(image => {
              const file = image.props.file

              return typeof file === 'string'
                ? file
                : file?.type === 'makeswift-file'
                  ? file.id
                  : file?.url
            })}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          images: Images(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(fileId)
  })

  test('can render ImagesPropController v2 data', async () => {
    // Arrange
    const imagesDefinitionV2: ImagesDescriptor = {
      type: Types.Images,
      version: 2,
      options: {},
    }
    const fileId = 'fileId'
    const imagesData: ImagesData = [
      {
        key: 'key',
        version: 1,
        props: {
          file: {
            version: 1,
            type: 'makeswift-file',
            id: fileId,
          },
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
          images: createImagesPropControllerDataFromImagesData(imagesData, imagesDefinitionV2),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { images?: ImagesData }>(({ images }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {images?.map(image => {
              const file = image.props.file

              return typeof file === 'string'
                ? file
                : file?.type === 'makeswift-file'
                  ? file.id
                  : file?.url
            })}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          images: Images(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(fileId)
  })
})

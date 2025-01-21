/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Video,
  VideoDescriptor,
  Types,
  createVideoPropControllerDataFromVideoData,
  VideoData,
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
  test('can render VideoPropController v0 data', async () => {
    // Arrange
    const videoDefinitionV0: VideoDescriptor = {
      type: Types.Video,
      options: {},
    }
    const videoData: VideoData = {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          video: createVideoPropControllerDataFromVideoData(videoData, videoDefinitionV0),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { video?: VideoData }>(({ video }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {video?.url}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          video: Video(),
        },
      },
    )

    await act(async () =>
      render(
        <ReactRuntimeProvider runtime={runtime} previewMode={false}>
          <Page snapshot={snapshot} />
        </ReactRuntimeProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    )
  })

  test('can render VideoPropController v1 data', async () => {
    // Arrange
    const videoDefinitionV1: VideoDescriptor = {
      type: Types.Video,
      version: 1,
      options: {},
    }
    const videoData: VideoData = {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          video: createVideoPropControllerDataFromVideoData(videoData, videoDefinitionV1),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { video?: VideoData }>(({ video }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {video?.url}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          video: Video(),
        },
      },
    )

    await act(async () =>
      render(
        <ReactRuntimeProvider runtime={runtime} previewMode={false}>
          <Page snapshot={snapshot} />
        </ReactRuntimeProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    )
  })
})

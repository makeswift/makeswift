/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  Link,
  LinkData,
  LinkDescriptor,
  Types,
  createLinkPropControllerDataFromLinkData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntimeProvider } from '../../../context/react-runtime'
import { ReactRuntime } from '../../../../react'
import { forwardRef } from 'react'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../utils/tests/element-data-test-test'

describe('Page', () => {
  test('can render LinkPropController v0 data', async () => {
    // Arrange
    const linkDefinitionV0: LinkDescriptor = {
      type: Types.Link,
      options: {},
    }
    const link: LinkData = {
      type: 'OPEN_URL',
      payload: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        openInNewTab: false,
      },
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          link: createLinkPropControllerDataFromLinkData(link, linkDefinitionV0),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { link?: LinkData }>(({ link }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {link?.type === 'OPEN_URL' ? link.payload.url : undefined}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          link: Link(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(link.payload.url)
  })

  test('can render LinkPropController v1 data', async () => {
    // Arrange
    const linkDefinitionV1: LinkDescriptor = {
      type: Types.Link,
      version: 1,
      options: {},
    }
    const link: LinkData = {
      type: 'OPEN_URL',
      payload: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        openInNewTab: false,
      },
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          link: createLinkPropControllerDataFromLinkData(link, linkDefinitionV1),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { link?: LinkData }>(({ link }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {link?.type === 'OPEN_URL' ? link.payload.url : undefined}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          link: Link(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(link.payload.url)
  })
})

/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  NavigationLinks,
  NavigationLinksDescriptor,
  Types,
  createNavigationLinksPropControllerDataFromNavigationLinksData,
  NavigationLinksData,
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
  test('can render NavigationLinksPropController v0 data', async () => {
    // Arrange
    const navigationLinksDefinitionV0: NavigationLinksDescriptor = {
      type: Types.NavigationLinks,
      options: {},
    }
    const navigationLinksData: NavigationLinksData = [
      {
        id: '1',
        type: 'button',
        payload: {
          label: 'Test link',
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
          navigationLinks: createNavigationLinksPropControllerDataFromNavigationLinksData(
            navigationLinksData,
            navigationLinksDefinitionV0,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { navigationLinks?: NavigationLinksData }>(
        ({ navigationLinks }, ref) => {
          return (
            <div ref={ref} data-testid={testId}>
              {navigationLinks?.at(0)?.payload.label}
            </div>
          )
        },
      ),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          navigationLinks: NavigationLinks(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('Test link')
  })

  test('can render NavigationLinksPropController v1 data', async () => {
    // Arrange
    const navigationLinksDefinitionV1: NavigationLinksDescriptor = {
      type: Types.NavigationLinks,
      version: 1,
      options: {},
    }
    const navigationLinksData: NavigationLinksData = [
      {
        id: '1',
        type: 'button',
        payload: {
          label: 'Test link',
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
          navigationLinks: createNavigationLinksPropControllerDataFromNavigationLinksData(
            navigationLinksData,
            navigationLinksDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { navigationLinks?: NavigationLinksData }>(
        ({ navigationLinks }, ref) => {
          return (
            <div ref={ref} data-testid={testId}>
              {navigationLinks?.at(0)?.payload.label}
            </div>
          )
        },
      ),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          navigationLinks: NavigationLinks(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent('Test link')
  })
})

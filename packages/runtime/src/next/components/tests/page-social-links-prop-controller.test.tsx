/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../state/react-page'
import { randomUUID } from 'crypto'
import {
  SocialLinks,
  SocialLinksData,
  SocialLinksDescriptor,
  Types,
  createSocialLinksPropControllerDataFromSocialLinksData,
} from '@makeswift/prop-controllers'
import { Page } from '../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntimeProvider } from '../../context/react-runtime'
import { ReactRuntime } from '../../../react'
import { forwardRef } from 'react'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../utils/tests/element-data-test-test'

describe('Page', () => {
  test('can render SocialLinksPropController v1 data', async () => {
    // Arrange
    const socialLinksDefinitionV1: SocialLinksDescriptor = {
      type: Types.SocialLinks,
      version: 1,
      options: {},
    }
    const url = 'https://facebook.com/mark'
    const links: SocialLinksData = {
      links: [
        {
          id: 'id',
          payload: { url, type: 'facebook' },
        },
      ],
      openInNewTab: false,
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          socialLinks: createSocialLinksPropControllerDataFromSocialLinksData(
            links,
            socialLinksDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { socialLinks?: SocialLinksData }>(({ socialLinks }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {socialLinks?.links.at(0)?.payload.url}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          socialLinks: SocialLinks(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(url)
  })

  test('can render SocialLinksPropController v2 data', async () => {
    // Arrange
    const socialLinksDefinitionV2: SocialLinksDescriptor = {
      type: Types.SocialLinks,
      version: 2,
      options: {},
    }
    const url = 'https://facebook.com/mark'
    const links: SocialLinksData = {
      links: [
        {
          id: 'id',
          payload: { url, type: 'facebook' },
        },
      ],
      openInNewTab: false,
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          socialLinks: createSocialLinksPropControllerDataFromSocialLinksData(
            links,
            socialLinksDefinitionV2,
          ),
        },
      },
    ])
    const snapshot = createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { socialLinks?: SocialLinksData }>(({ socialLinks }, ref) => {
        return (
          <div ref={ref} data-testid={testId}>
            {socialLinks?.links.at(0)?.payload.url}
          </div>
        )
      }),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          socialLinks: SocialLinks(),
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

    expect(screen.getByTestId(testId)).toHaveTextContent(url)
  })
})

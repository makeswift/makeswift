/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { forwardRef } from 'react'

import {
  createMakeswiftPageSnapshot,
  testMakeswiftPageRendering,
  createRootComponent,
} from '../../../testing'

import { pageDocument } from '../__fixtures__/page-document'
import {
  buttonComponentData,
  linkData,
  linkUrlData,
} from '../__fixtures__/element-data/button-component'
import * as Resources from '../__fixtures__/resources'

jest.mock('next/link', () => ({
  __esModule: true,
  default: forwardRef<HTMLDivElement, any>(
    jest
      .fn()
      .mockImplementation(({ legacyBehavior, ...props }, ref) => (
        <a
          ref={ref}
          {...props}
          data-next-link="true"
          data-next-link-legacy-behavior={legacyBehavior}
        />
      )),
  ),
}))

const createPageWithButton = (...args: Parameters<typeof buttonComponentData>) => {
  const button = buttonComponentData(...args)

  return createMakeswiftPageSnapshot(
    {
      ...pageDocument,
      data: createRootComponent([button]),
    },
    {
      cacheData: {
        apiResources: {
          PagePathnameSlice: [
            {
              id: Resources.pagePathnameSlice1.id,
              value: Resources.pagePathnameSlice1,
            },
          ],
        },
      },
    },
  )
}

describe('correctly renders button component', () => {
  const htmlId = 'test-button'

  test('with link', async () => {
    const snapshot = createPageWithButton({
      htmlId,
      linkData: linkData.url,
    })

    const render = await testMakeswiftPageRendering({ snapshot })
    expect(render.container.querySelector(`#${htmlId}`)).toMatchSnapshot()
  })

  test.each([linkData.page, linkData.url, linkData.email, linkData.phone, linkData.element])(
    'with $type link',
    async linkData => {
      const snapshot = createPageWithButton({
        htmlId,
        linkData,
      })

      const render = await testMakeswiftPageRendering({ snapshot })
      const button = render.container.querySelector(`#${htmlId}`)
      button?.setAttribute('class', '[redacted]')
      expect(button).toMatchSnapshot()
    },
  )

  test.each([
    linkUrlData(''),
    linkUrlData('http:'),
    linkUrlData('http://'),
    linkUrlData('https:'),
    linkUrlData('https://'),
    linkUrlData('file:'),
    linkUrlData('file://'),
    linkUrlData('file://server/path'),
    linkUrlData('mailto:alan@makeswift.com'),
    linkUrlData('phone:+15551234567'),
  ])('with $type link $payload.url', async linkData => {
    const snapshot = createPageWithButton({
      htmlId,
      linkData,
    })

    const render = await testMakeswiftPageRendering({ snapshot })
    const button = render.container.querySelector(`#${htmlId}`)
    button?.setAttribute('class', '[redacted]')
    expect(button).toMatchSnapshot()
  })
})

/** @jest-environment jsdom */
import { forwardRef } from 'react'
import { Link } from '../../../../controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { APIResourceType } from '../../../../api'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../mocks/server'
import { MakeswiftComponentType } from '../../../../components'
import { ElementID } from '@makeswift/prop-controllers'
import { ReactRuntime } from '../../../../react'

const Button = forwardRef(function Button({ id }: { id?: string }, _ref) {
  return <button id={id} />
})

const pathnameSlicesBaseUrl = `/api/makeswift/page-pathname-slices`

const pageId = '[test-page-id]'

const pagePathnameSlice = {
  __typename: APIResourceType.PagePathnameSlice,
  id: pageId,
  pathname: 'test-pathname',
}

const localizedPagePathnameSlice = {
  __typename: APIResourceType.PagePathnameSlice,
  id: pageId,
  basePageId: '[test-base-page-id]',
  pathname: 'fr-FR/test-localized-pathname',
}

const openPageLink = {
  type: 'OPEN_PAGE',
  payload: { pageId, openInNewTab: false },
} as const

const openUrlLink = {
  type: 'OPEN_URL',
  payload: { url: 'https://example.com', openInNewTab: false },
} as const

const sendEmailLink = {
  type: 'SEND_EMAIL',
  payload: { to: 'bob@gmail.com', subject: 'hello', body: 'world' },
} as const

const callPhoneLink = {
  type: 'CALL_PHONE',
  payload: { phoneNumber: '555-555-5555' },
} as const

const scrollToElementLink = {
  type: 'SCROLL_TO_ELEMENT',
  payload: {
    elementIdConfig: { elementKey: 'key', propName: 'prop' },
    block: 'start',
  },
} as const

describe('Page', () => {
  test.each([openUrlLink, sendEmailLink, callPhoneLink, scrollToElementLink, null] as const)(
    'Link control data %s',
    async value => {
      await testPageControlPropRendering(Link(), { value })
    },
  )

  describe.each([null, 'fr-FR'])('Link control data OPEN_PAGE for locale %s', locale => {
    const pathnameSlice = locale ? localizedPagePathnameSlice : pagePathnameSlice

    test('resolves default link attributes when unable to find pathname slice', async () => {
      await testPageControlPropRendering(Link(), {
        value: openPageLink,
        locale,
        cacheData: {
          apiResources: {
            PagePathnameSlice: [{ id: pageId, value: null, locale }],
          },
        },
      })
    })

    test('fetches pathname slice when not in cache', async () => {
      server.use(
        http.get(`${pathnameSlicesBaseUrl}/${openPageLink.payload.pageId}`, ({ request }) => {
          const requestedLocale = new URL(request.url).searchParams.get('locale')
          return requestedLocale === locale
            ? HttpResponse.json(pathnameSlice)
            : HttpResponse.json(null)
        }),
      )
      await testPageControlPropRendering(Link(), {
        value: openPageLink,
        locale,
        expectedRenders: 2,
      })
    })

    test('renders page link when page pathname slice is in cache', async () => {
      await testPageControlPropRendering(Link(), {
        value: openPageLink,
        locale,
        cacheData: {
          apiResources: {
            PagePathnameSlice: [{ id: pageId, value: pathnameSlice, locale }],
          },
        },
        expectedRenders: 1,
      })
    })
  })

  describe('Link control data SCROLL_TO_ELEMENT', () => {
    test('resolves default link attributes when elementIdConfig is not provided', async () => {
      await testPageControlPropRendering(Link(), {
        value: scrollToElementLink,
      })
    })

    test('resolves scroll target when element key is on screen', async () => {
      await testPageControlPropRendering(Link(), {
        value: scrollToElementLink,
        expectedRenders: 1,
        registerComponents: (runtime: ReactRuntime) => {
          runtime.registerComponent(Button, {
            type: MakeswiftComponentType.Button,
            label: 'Button',
            props: {
              id: ElementID(),
            },
          })
        },
        rootElements: [
          {
            key: 'key',
            type: MakeswiftComponentType.Button,
            props: {
              id: 'test-element-id',
            },
          },
        ],
      })
    })
  })
})

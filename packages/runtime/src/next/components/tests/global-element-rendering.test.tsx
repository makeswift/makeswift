/** @jest-environment jsdom */

import { act } from 'react-dom/test-utils'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { APIResourceType, type LocalizedGlobalElement, type GlobalElement } from '../../../api'
import { ReactRuntime } from '../../../react'
import * as Testing from '../../../runtimes/react/testing'

import { Page } from '../page'

const globalElementId = 'R2xvYmFsRWxlbWVudDpjMzM2MDJiZC00NmFmLTQ0ZWMtODAxZi0zODVmMTEzY2Q1NzA='
const localizedGlobalElementId =
  'R2xvYmFsRWxlbWVudDpjMzM2MDJiZC00NmFmLTQ0ZWMtODAxZi0zODVmMTEzY2Q1NzA='

const swatchId = 'U3dhdGNoOjNhN2ViYWFkLTZkMTMtNDRiZC1hZDQxLWQ1NDNlMGQwMDRlMQ=='

const pageElementData = {
  key: '31bf33d5-7cde-495e-a38e-c734ba8de75e',
  props: {
    children: {
      '@@makeswift/type': 'prop-controllers::grid::v1',
      value: {
        columns: [
          {
            deviceId: 'desktop',
            value: {
              count: 12,
              spans: [[12]],
            },
          },
        ],
        elements: [
          {
            key: '71394e9c-92cd-400f-b8ba-4d4cd12dc603',
            type: 'reference',
            value: globalElementId,
          },
        ],
      },
    },
  },
  type: './components/Root/index.js',
}

const globalElementData = {
  key: '2c3d5c2a-ea20-4bc9-af04-3ce3238b4c73',
  type: './components/Text/index.js',
  props: {
    id: { value: 'title', '@@makeswift/type': 'prop-controllers::element-id::v1' },
    text: {
      key: '79d65529-9b89-4415-ba7a-dec2972d6065',
      type: 'makeswift::controls::rich-text-v2',
      version: 2,
      descendants: [
        {
          type: 'default',
          children: [
            {
              text: 'About Us',
              typography: {
                style: [
                  { value: { fontSize: { unit: 'px', value: 16 } }, deviceId: 'mobile' },
                  {
                    value: {
                      italic: false,
                      fontSize: { unit: 'px', value: 30 },
                      fontFamily: 'Lato',
                      fontWeight: 700,
                      lineHeight: 1.5,
                    },
                    deviceId: 'desktop',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    width: [{ value: { unit: 'px', value: 700 }, deviceId: 'desktop' }],
    margin: {
      value: [
        {
          value: {
            marginTop: { unit: 'px', value: 40 },
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: { unit: 'px', value: 20 },
          },
          deviceId: 'desktop',
        },
      ],
      '@@makeswift/type': 'prop-controllers::margin::v1',
    },
  },
} as GlobalElement['data']

const localizedGlobalElementData = {
  key: '2c3d5c2a-ea20-4bc9-af04-3ce3238b4c73',
  type: './components/Text/index.js',
  props: {
    id: { value: 'title', '@@makeswift/type': 'prop-controllers::element-id::v1' },
    text: {
      key: '9e7388b1-b743-4c2e-97ca-2af6ddca304f',
      type: 'makeswift::controls::rich-text-v2',
      version: 2,
      descendants: [
        {
          type: 'default',
          children: [
            {
              text: 'À propos de nous',
              typography: {
                style: [
                  { value: { fontSize: { unit: 'px', value: 16 } }, deviceId: 'mobile' },
                  {
                    value: {
                      color: {
                        alpha: 1,
                        swatchId,
                      },
                      italic: false,
                      fontSize: { unit: 'px', value: 30 },
                      fontFamily: 'Lato',
                      fontWeight: 700,
                      lineHeight: 1.5,
                    },
                    deviceId: 'desktop',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    width: [{ value: { unit: 'px', value: 700 }, deviceId: 'desktop' }],
    margin: {
      value: [
        {
          value: {
            marginTop: { unit: 'px', value: 40 },
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: { unit: 'px', value: 20 },
          },
          deviceId: 'desktop',
        },
      ],
      '@@makeswift/type': 'prop-controllers::margin::v1',
    },
  },
} as LocalizedGlobalElement['data']

async function testGlobalElementRendering({ locale }: { locale: string | null }) {
  const runtime = new ReactRuntime()
  const snapshot = Testing.createMakeswiftPageSnapshot(pageElementData, {
    locale,
    cacheData: {
      apiResources: {
        [APIResourceType.GlobalElement]: [
          {
            id: globalElementId,
            value: {
              __typename: APIResourceType.GlobalElement,
              id: globalElementId,
              data: globalElementData,
            },
          },
        ],
        [APIResourceType.LocalizedGlobalElement]: [
          {
            id: localizedGlobalElementId,
            value: {
              __typename: APIResourceType.LocalizedGlobalElement,
              id: localizedGlobalElementId,
              data: localizedGlobalElementData,
            },
            locale: 'fr-FR',
          },
        ],
        [APIResourceType.Swatch]: [
          {
            id: swatchId,
            value: {
              __typename: APIResourceType.Swatch,
              id: swatchId,
              hue: 238,
              saturation: 87,
              lightness: 49,
            },
          },
        ],
      },
      localizedResourcesMap: {
        'fr-FR': {
          [globalElementId]: localizedGlobalElementId,
        },
      },
    },
  })

  // Assert
  await act(async () =>
    render(
      <Testing.ReactProvider runtime={runtime}>
        <Page snapshot={snapshot} />
      </Testing.ReactProvider>,
    ),
  )

  expect(document.querySelector('#title')).toMatchSnapshot()
}

describe('Page', () => {
  test('correctly renders a global element', async () => {
    await testGlobalElementRendering({
      locale: null,
    })
  })

  test('correctly renders a localized global element', async () => {
    await testGlobalElementRendering({
      locale: 'fr-FR',
    })
  })
})

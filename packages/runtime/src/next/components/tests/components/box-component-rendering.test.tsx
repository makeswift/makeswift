/** @jest-environment jsdom */

import '@testing-library/jest-dom'

import {
  createMakeswiftPageSnapshot,
  testMakeswiftPageRendering,
  createRootComponent,
} from '../../../testing'

import { pageDocument } from '../__fixtures__/page-document'
import {
  boxComponentData,
  imageBackgroundData,
  inlineColorBackgroundData,
} from '../__fixtures__/element-data/box-component'
import * as Resources from '../__fixtures__/resources'

const createPageWithBox = (...args: Parameters<typeof boxComponentData>) => {
  const box = boxComponentData(...args)

  return createMakeswiftPageSnapshot(
    {
      ...pageDocument,
      data: createRootComponent([box]),
    },
    {
      cacheData: {
        apiResources: {
          File: [
            {
              id: Resources.file1.id,
              value: Resources.file1,
            },
          ],
        },
      },
    },
  )
}

describe('correctly renders box component', () => {
  test('with background image', async () => {
    const htmlId = 'test-box'
    const snapshot = createPageWithBox({
      htmlId,
      backgrounds: [imageBackgroundData(Resources.file1.id)],
    })

    const render = await testMakeswiftPageRendering({ snapshot })
    expect(render.container.querySelector(`#${htmlId}`)).toMatchSnapshot()
  })
  test('with inline color background', async () => {
    const htmlId = 'test-box'
    const snapshot = createPageWithBox({
      htmlId,
      backgrounds: [inlineColorBackgroundData()],
    })

    const render = await testMakeswiftPageRendering({ snapshot })
    expect(render.container.querySelector(`#${htmlId}`)).toMatchSnapshot()
  })

  describe('with a height that is not one of the Height options', () => {
    test.each([
      ['on every device', [{ deviceId: 'desktop', value: 'calc(0.5 * 100vw * 0.8333)' }]],
      [
        'on desktop, with `auto` on mobile',
        [
          { deviceId: 'desktop', value: '300px' },
          { deviceId: 'mobile', value: 'auto' },
        ],
      ],
      [
        'on mobile, with `stretch` on desktop',
        [
          { deviceId: 'desktop', value: 'stretch' },
          { deviceId: 'mobile', value: '300px' },
        ],
      ],
    ])('%s', async (_, height) => {
      const htmlId = 'test-box'
      const snapshot = createPageWithBox({ htmlId, height })

      const render = await testMakeswiftPageRendering({ snapshot })
      expect(render.container.querySelector(`#${htmlId}`)).toMatchSnapshot()
    })
  })
})

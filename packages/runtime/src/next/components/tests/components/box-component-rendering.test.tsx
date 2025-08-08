/** @jest-environment jsdom */

import '@testing-library/jest-dom'

import {
  createMakeswiftPageSnapshot,
  testMakeswiftPageRendering,
  createRootComponent,
} from '../../../testing'

import { pageDocument } from '../__fixtures__/page-document'
import { boxComponentData, imageBackgroundData } from '../__fixtures__/element-data/box-component'
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
})

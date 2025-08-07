/** @jest-environment jsdom */

import '@testing-library/jest-dom'

import {
  createMakeswiftPageSnapshot,
  testMakeswiftPageRendering,
  createRootComponent,
} from '../../../testing'

import { pageDocument } from '../__fixtures__/page-document'
import { imageComponentData } from '../__fixtures__/element-data/image-component'
import * as Resources from '../__fixtures__/resources'

const createPageWithImage = (htmlId: string) => {
  const image = imageComponentData({
    htmlId,
    swatchId: Resources.swatch1.id,
    fileId: Resources.file1.id,
  })

  return createMakeswiftPageSnapshot(
    {
      ...pageDocument,
      data: createRootComponent([image]),
    },
    {
      cacheData: {
        apiResources: {
          Swatch: [
            {
              id: Resources.swatch1.id,
              value: Resources.swatch1,
            },
          ],
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

test('correctly renders image component', async () => {
  const htmlId = 'test-image'
  const snapshot = createPageWithImage(htmlId)
  const render = await testMakeswiftPageRendering({ snapshot })
  expect(render.container.querySelector(`#${htmlId}`)).toMatchSnapshot()
})

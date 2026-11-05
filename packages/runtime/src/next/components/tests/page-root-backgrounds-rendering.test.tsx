/** @jest-environment jsdom */

import '@testing-library/jest-dom'

import { type ElementData } from '@makeswift/controls'
import { type BackgroundData } from '@makeswift/prop-controllers'

import {
  createMakeswiftPageSnapshot,
  createRootComponent,
  testMakeswiftPageRendering,
} from '../../testing'

import { pageDocument } from './__fixtures__/page-document'
import { inlineColorBackgroundData } from './__fixtures__/element-data/box-component'

const createPageWithRootBackgrounds = (backgrounds: BackgroundData[]) => {
  const root = createRootComponent([])

  return createMakeswiftPageSnapshot({
    ...pageDocument,
    data: {
      ...root,
      props: {
        ...root.props,
        backgrounds: {
          '@@makeswift/type': 'prop-controllers::backgrounds::v3',
          value: [{ deviceId: 'desktop', value: backgrounds }],
        },
      },
    } as ElementData,
  })
}

const getHtmlRules = () =>
  Array.from(document.head.querySelectorAll('style'))
    .flatMap(style => style.textContent?.match(/html\{[^}]*background[^}]*\}/g) ?? [])
    .join('\n')

describe('page root backgrounds', () => {
  test('are assigned to the html element instead of the root element', async () => {
    const snapshot = createPageWithRootBackgrounds([inlineColorBackgroundData()])
    const render = await testMakeswiftPageRendering({ snapshot })

    expect(getHtmlRules()).toContain('background-image:linear-gradient(hsla(238,87%,49%,0.5)')
    expect(render.container.querySelector('[style*="background"]')).toBeNull()
    expect(render.container.firstElementChild?.children).toHaveLength(1)
  })

  test('default to a white html background', async () => {
    const snapshot = createPageWithRootBackgrounds([])
    await testMakeswiftPageRendering({ snapshot })

    expect(getHtmlRules()).toContain('background-color:white')
  })
})

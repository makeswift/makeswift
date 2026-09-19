/** @jest-environment jsdom */

import '@testing-library/jest-dom'

import {
  createMakeswiftPageSnapshot,
  createRootComponent,
  testMakeswiftPageRendering,
} from '../../testing'

describe('Page root rendering', () => {
  test('root stretches to cover at least the entire viewport', async () => {
    const snapshot = createMakeswiftPageSnapshot(createRootComponent([]))

    const { container } = await testMakeswiftPageRendering({ snapshot })

    const root = container.firstElementChild
    expect(root).toBeInTheDocument()

    const rootStyles = Array.from(root?.classList ?? []).flatMap(className =>
      Array.from(document.querySelectorAll(`style[data-href="${className}"]`)).map(
        style => style.textContent ?? '',
      ),
    )

    const rootCss = rootStyles.join('\n')

    expect(rootCss).toEqual(expect.stringContaining('min-height:100vh'))
    expect(rootCss).toEqual(expect.stringContaining('@supports (min-height: 100dvh)'))
  })
})

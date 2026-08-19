/** @jest-environment jsdom */
import { RichText } from '../../../../../controls'

import { testPageControlPropRendering } from '../page-control-prop-rendering'
import { value, cacheData } from './fixtures'

test.each([RichText.Mode.Inline, RichText.Mode.Block])(
  `renders a %s placeholder when empty`,
  async mode => {
    await testPageControlPropRendering(RichText({ mode }), {
      value: undefined,
      expectedRenders: 1,
    })
  },
)

test(`renders provided text content`, async () => {
  await testPageControlPropRendering(RichText(), {
    value,
    cacheData: cacheData(),
    expectedRenders: 1,
  })
})

test(`editable text reverts host styles on slate-internal text spans`, async () => {
  const slateInternalNodeAttributes = ['data-slate-string', 'data-slate-zero-width']

  await testPageControlPropRendering(RichText(), {
    value,
    cacheData: cacheData(),
    isInBuilder: true,
    isReadOnly: false,
  })

  for (const attribute of slateInternalNodeAttributes) {
    const internalNodes = Array.from(document.querySelectorAll(`[${attribute}]`))
    expect(internalNodes.length).toBeGreaterThan(0)

    for (const node of internalNodes) {
      expect(window.getComputedStyle(node).getPropertyValue('all')).toBe('revert')
    }
  }
})

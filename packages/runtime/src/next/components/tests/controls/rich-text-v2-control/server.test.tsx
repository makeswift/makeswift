import { RichText } from '../../../../../controls'

import { testPageControlPropRendering } from '../page-control-prop-rendering'
import { value, cacheData } from './fixtures'

test.each([RichText.Mode.Inline, RichText.Mode.Block])(
  `renders a %s placeholder when empty`,
  async mode => {
    await testPageControlPropRendering(RichText({ mode }), {
      value: undefined,
    })
  },
)

test(`renders provided text content`, async () => {
  await testPageControlPropRendering(RichText(), {
    value,
    cacheData: cacheData(),
  })
})

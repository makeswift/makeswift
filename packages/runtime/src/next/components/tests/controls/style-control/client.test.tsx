/**
 * @jest-environment jsdom
 */
import { Style } from '../../../../../controls'
import { testPageControlPropRendering } from '../page-control-prop-rendering'
import {
  value,
  valueWithFontFamily,
  valueWithCSSVariableFontFamily,
  valueWithInlineBorderColor,
  registerComponents,
} from './fixtures'

test(`renders a style`, async () => {
  await testPageControlPropRendering(Style(), {
    value,
    registerComponents,
    expectedRenders: 1,
  })
})

test(`renders a style with fontFamily`, async () => {
  await testPageControlPropRendering(Style({ properties: Style.All }), {
    value: valueWithFontFamily,
    registerComponents,
    expectedRenders: 1,
  })
})

test(`renders a style with CSS variable fontFamily`, async () => {
  await testPageControlPropRendering(Style({ properties: Style.All }), {
    value: valueWithCSSVariableFontFamily,
    registerComponents,
    expectedRenders: 1,
  })
})

test(`renders a style with an inline border color`, async () => {
  await testPageControlPropRendering(Style({ properties: Style.All }), {
    value: valueWithInlineBorderColor,
    registerComponents,
    expectedRenders: 1,
  })
})

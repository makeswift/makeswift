import { Style } from '../../../../../controls'
import { testPageControlPropRendering } from '../page-control-prop-rendering'
import {
  value,
  valueWithFontFamily,
  valueWithCSSVariableFontFamily,
  registerComponents,
} from './fixtures'

test(`renders a style`, async () => {
  await testPageControlPropRendering(Style(), {
    value,
    registerComponents,
  })
})

test(`renders a style with fontFamily`, async () => {
  await testPageControlPropRendering(Style({ properties: Style.All }), {
    value: valueWithFontFamily,
    registerComponents,
  })
})

test(`renders a style with CSS variable fontFamily`, async () => {
  await testPageControlPropRendering(Style({ properties: Style.All }), {
    value: valueWithCSSVariableFontFamily,
    registerComponents,
  })
})

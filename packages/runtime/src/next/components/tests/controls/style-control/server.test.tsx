import { Style } from '../../../../../controls'
import { testPageControlPropRendering } from '../page-control-prop-rendering'
import { value, registerComponents } from './fixtures'

test(`renders a style`, async () => {
  await testPageControlPropRendering(Style(), {
    value,
    registerComponents,
  })
})

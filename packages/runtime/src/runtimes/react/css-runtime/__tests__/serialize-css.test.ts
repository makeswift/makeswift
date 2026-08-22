import { toCssStatements } from '../serialize-css'
import { sampleJsStylesObjects } from './__fixtures__/sample-js-styles-objects'

describe('toCssStatements', () => {
  test.each(sampleJsStylesObjects)('$description', ({ className, stylesObject }) => {
    const { css } = toCssStatements(stylesObject, className)
    expect(css).toMatchSnapshot()
  })
})

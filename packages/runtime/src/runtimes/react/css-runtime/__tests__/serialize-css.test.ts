import { processCss, toCssStatements } from '../serialize-css'
import { sampleJsStylesObjects } from './__fixtures__/sample-js-styles-objects'

describe('toCssStatements', () => {
  test.each(sampleJsStylesObjects)('$description', ({ className, stylesObject }) => {
    const { css } = toCssStatements(stylesObject, className)
    expect(css).toMatchSnapshot()
  })

  describe('when forceImportant=true', () => {
    test.each(sampleJsStylesObjects)(
      'appends `!important` to each declaration in $description',
      ({ className, stylesObject }) => {
        const { css } = toCssStatements(stylesObject, className, { forceImportant: true })
        expect(css).toMatchSnapshot()
      },
    )
  })
})

describe('processCss', () => {
  describe('when forceImportant=true', () => {
    test.each([
      {
        content: '@font-face { font-family: Fancy; src: url(fancy.woff2) }',
        description: 'descriptors',
      },
      {
        content: '@keyframes fade { from { opacity: 0 } to { opacity: 1 } }',
        description: 'keyframe declarations',
      },
    ])('does not append `!important` to $description', ({ content }) => {
      const css = processCss({
        content,
        forceImportant: true,
      })

      expect(css).toMatchSnapshot()
    })
  })
})

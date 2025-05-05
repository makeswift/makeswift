import { createClearContext, createReplacementContext } from '../../../context'

import * as Fixtures from '../__fixtures__'

import { copyRichTextData } from './copy'

describe('GIVEN copying RichText', () => {
  test('replaces the swatch, typography and page ids', () => {
    const expected = JSON.parse(
      JSON.stringify(Fixtures.introspection)
        .replace(Fixtures.SWATCH_ID, 'replaced-swatch-id')
        .replace(Fixtures.TYPOGRAPHY_ID, 'replaced-typography-id')
        .replace(Fixtures.PAGE_ID, 'replaced-page-id'),
    )

    const result = copyRichTextData(Fixtures.introspection, {
      replacementContext: createReplacementContext({
        swatchIds: { [Fixtures.SWATCH_ID]: 'replaced-swatch-id' },
        typographyIds: { [Fixtures.TYPOGRAPHY_ID]: 'replaced-typography-id' },
        pageIds: { [Fixtures.PAGE_ID]: 'replaced-page-id' },
      }),
      clearContext: createClearContext({}),
      copyElement: (node) => node,
    })

    expect(result).toMatchObject(expected)
  })
})

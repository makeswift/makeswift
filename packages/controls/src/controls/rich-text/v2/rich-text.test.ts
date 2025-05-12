import { createReplacementContext } from '../../../context'

import * as Fixtures from '../__fixtures__'

import { RichText, RichTextDefinition } from './testing'

describe('RichText v2', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(RichText()).toMatchSnapshot('default')
      expect(
        RichText({
          mode: RichText.Mode.Inline,
          defaultValue: 'your message',
        }),
      ).toMatchSnapshot('inline mode')
    })

    test('disallows extraneous properties', () => {
      RichText({
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: RichTextDefinition) {}
    assignTest(RichText())
    assignTest(RichText({ mode: RichText.Mode.Block }))
    assignTest(
      RichText({
        mode: RichText.Mode.Inline,
        defaultValue: 'your message',
      }),
    )
  })

  test('copyData on v1 data promotes to v2 data and replaces swatch, typography, and page IDs', () => {
    const definition = RichText()
    const expected = JSON.parse(
      JSON.stringify(RichTextDefinition.normalizeData(Fixtures.introspection))
        .replace(Fixtures.SWATCH_ID, 'replaced-swatch-id')
        .replace(Fixtures.TYPOGRAPHY_ID, 'replaced-typography-id')
        .replace(Fixtures.PAGE_ID, 'replaced-page-id'),
    )

    const result = definition.copyData(Fixtures.introspection, {
      replacementContext: createReplacementContext({
        swatchIds: { [Fixtures.SWATCH_ID]: 'replaced-swatch-id' },
        typographyIds: { [Fixtures.TYPOGRAPHY_ID]: 'replaced-typography-id' },
        pageIds: { [Fixtures.PAGE_ID]: 'replaced-page-id' },
      }),
      copyElement: (node) => node,
    })

    expect(RichTextDefinition.isV1Data(result)).toBe(false)

    expect({ ...result, key: expect.any(String) }).toMatchObject({
      ...expected,
      key: expect.any(String),
    })
  })

  test('copyData removes swatch, typographies, and page IDs that are marked for removal', () => {
    const definition = RichText()

    const result = definition.copyData(Fixtures.introspection, {
      replacementContext: createReplacementContext({
        swatchIds: { [Fixtures.SWATCH_ID]: null },
        typographyIds: { [Fixtures.TYPOGRAPHY_ID]: null },
        pageIds: { [Fixtures.PAGE_ID]: null },
      }),
      copyElement: (node) => node,
    })

    expect({ ...result, key: expect.any(String) }).toMatchSnapshot()
  })
})

import { Font, FontDefinition } from './font'

describe('Font', () => {
  describe('constructor', () => {
    test.each([
      undefined,
      { fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 500 },
    ])('returns correct definition', (defaultValue) => {
      expect(Font({ defaultValue })).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      Font({
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: FontDefinition) {}
    assignTest(Font())
  })
})

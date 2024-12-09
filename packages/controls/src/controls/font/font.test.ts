import { Font, FontDefinition } from './font'

describe('Font', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(Font()).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      // @ts-expect-error
      Font({
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: FontDefinition) {}
    assignTest(Font())
  })
})

import {
  unstable_Typography,
  unstable_TypographyDefinition,
} from './typography'

describe('Typography', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(unstable_Typography()).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      // @ts-expect-error
      unstable_Typography({
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: unstable_TypographyDefinition) {}
    assignTest(unstable_Typography())
  })
})

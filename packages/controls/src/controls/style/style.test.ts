import { Style, StyleDefinition } from './style'

describe('Style', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(Style()).toMatchSnapshot('default')
      expect(
        Style({ properties: [Style.Border, Style.Margin] }),
      ).toMatchSnapshot('border and margin')

      expect(Style({ properties: Style.All })).toMatchSnapshot('all')
    })

    test('disallows extraneous properties', () => {
      Style({
        properties: [Style.Border],
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: StyleDefinition) {}
    assignTest(Style())
    assignTest(Style({ properties: [Style.Border] }))
    assignTest(Style({ properties: [Style.Border, Style.Padding] }))
    assignTest(Style({ properties: Style.All }))
  })
})

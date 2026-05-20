import { testDefinition, testResolveValue } from '../../testing/test-definition'

import { Slider, SliderDefinition } from './slider'

describe('Slider', () => {
  describe('constructor', () => {
    test.each([0, 50, 100, undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          Slider({
            label: 'volume',
            defaultValue: value,
            min: 0,
            max: 100,
          }),
        ).toMatchSnapshot()
      },
    )

    test('creates slider with step', () => {
      expect(
        Slider({
          label: 'opacity',
          defaultValue: 1,
          min: 0,
          max: 1,
          step: 0.1,
        }),
      ).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      Slider({
        label: undefined,
        defaultValue: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: SliderDefinition) {}

    assignTest(Slider())
    assignTest(Slider({ label: 'volume' }))
    assignTest(Slider({ defaultValue: 50 }))
    assignTest(Slider({ label: 'volume', defaultValue: 50 }))
    assignTest(Slider({ defaultValue: 0 as number }))
    assignTest(Slider({ defaultValue: undefined }))
    assignTest(Slider({ min: 0, max: 100 }))
    assignTest(Slider({ min: 0, max: 100, step: 1 }))
  })
})

describe.each([
  [
    Slider({ defaultValue: 50, label: 'volume', min: 0, max: 100 }),
    [0, 25, 50, 75, 100] as const,
  ],
  [Slider({ label: 'opacity' }), [0, 0.5, 1, undefined] as const],
])('Slider', (def, values) => {
  const invalidValues = [null, 'text', true, {}]
  testDefinition(def as any, values as any, invalidValues)
  testResolveValue(def as any, values as any)
})

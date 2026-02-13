import { testDefinition, testResolveValue } from '../../testing/test-definition'

import { Slider, SliderDefinition, type SliderRangeValue } from './slider'

describe('Slider', () => {
  describe('constructor', () => {
    describe('single value mode (default)', () => {
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
    })

    describe('range mode (range: true)', () => {
      test.each([{ start: 0, end: 100 }, { start: 25, end: 75 }, undefined])(
        'call with default value `%s` returns versioned definition',
        (value) => {
          expect(
            Slider({
              label: 'price range',
              defaultValue: value,
              min: 0,
              max: 100,
              range: true,
            }),
          ).toMatchSnapshot()
        },
      )

      test('creates range slider with step', () => {
        expect(
          Slider({
            label: 'opacity range',
            defaultValue: { start: 0.2, end: 0.8 },
            min: 0,
            max: 1,
            step: 0.1,
            range: true,
          }),
        ).toMatchSnapshot()
      })
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

    // Single value mode
    assignTest(Slider())
    assignTest(Slider({ label: 'volume' }))
    assignTest(Slider({ defaultValue: 50 }))
    assignTest(Slider({ label: 'volume', defaultValue: 50 }))
    assignTest(Slider({ defaultValue: 0 as number }))
    assignTest(Slider({ defaultValue: undefined }))
    assignTest(Slider({ min: 0, max: 100 }))
    assignTest(Slider({ min: 0, max: 100, step: 1 }))
    assignTest(Slider({ range: false }))

    // Range mode
    assignTest(Slider({ range: true }))
    assignTest(Slider({ label: 'range', range: true }))
    assignTest(Slider({ defaultValue: { start: 0, end: 100 }, range: true }))
    assignTest(
      Slider({
        label: 'range',
        defaultValue: { start: 0, end: 100 },
        range: true,
      }),
    )
    assignTest(Slider({ min: 0, max: 100, range: true }))
    assignTest(Slider({ min: 0, max: 100, step: 1, range: true }))
  })
})

// Test single value mode
describe.each([
  [
    Slider({ defaultValue: 50, label: 'volume', min: 0, max: 100 }),
    [0, 25, 50, 75, 100] as const,
  ],
  [Slider({ label: 'opacity' }), [0, 0.5, 1, undefined] as const],
])('Slider (single value)', (def, values) => {
  const invalidValues = [null, 'text', true, {}]
  testDefinition(def as any, values as any, invalidValues)
  testResolveValue(def as any, values as any)
})

// Test range mode
const rangeValues: SliderRangeValue[] = [
  { start: 0, end: 100 },
  { start: 25, end: 75 },
  { start: 50, end: 50 },
]

describe.each([
  [
    Slider({
      defaultValue: { start: 0, end: 100 },
      label: 'price',
      min: 0,
      max: 100,
      range: true,
    }),
    rangeValues,
  ],
  [Slider({ label: 'opacity', range: true }), [...rangeValues, undefined]],
])('Slider (range mode)', (def, values) => {
  const invalidValues = [null, 'text', true, 42, {}]
  testDefinition(def as any, values as any, invalidValues)
  testResolveValue(def as any, values as any)
})

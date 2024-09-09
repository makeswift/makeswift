import { testDefinition, testResolveValue } from '../../testing/test-definition'

import { unstable_IconRadioGroup as IconRadioGroup } from './icon-radio-group'

const options = [
  {
    value: 'code',
    label: 'Code',
    icon: IconRadioGroup.Icon.Code,
  },
  {
    value: 'superscript',
    label: 'Superscript',
    icon: IconRadioGroup.Icon.Superscript,
  },
] as const

describe('unstable_IconRadioGroup', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      const def = IconRadioGroup({
        label: 'Block type',
        options,
        defaultValue: 'code',
      })

      expect(def).toMatchSnapshot()
    })

    test('enforces item value type', () => {
      IconRadioGroup({
        label: 'Block type',
        options: [
          {
            // @ts-expect-error
            value: 42,
            label: 'Code',
            icon: IconRadioGroup.Icon.Code,
          },
        ],
      })
    })

    test('disallows extraneous properties', () => {
      IconRadioGroup({
        options,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    // FIXME
    // function assignTest(_def: IconRadioGroupDefinition) {}
    // assignTest(IconRadioGroup({ options }))
    // assignTest(IconRadioGroup({ label: 'Block type', options }))
    // assignTest(
    //   IconRadioGroup({ label: 'Block type', options, defaultValue: 'code' }),
    // )
    // assignTest(IconRadioGroup({ label: 'visible', defaultValue: undefined }))
    // assignTest(IconRadioGroup({ label: undefined, defaultValue: undefined }))
  })
})

describe.each([
  [IconRadioGroup({ options }), ['code', 'superscript', undefined] as const],
  [
    IconRadioGroup({ options, defaultValue: 'code' }),
    ['code', 'superscript'] as const,
  ],
])('unstable_IconRadioGroup', (def, values) => {
  const invalidValues = [null, 17, 'random', { swatchId: 42 }]
  testDefinition(def, values, invalidValues)
  testResolveValue(def, values)
})

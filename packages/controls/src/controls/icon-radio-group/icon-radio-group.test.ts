import { testDefinition, testResolveValue } from '../../testing/test-definition'
import { TestSerializationVisitor } from '../../testing/test-serialization-visitor'

import { deserializeRecord, type SerializedRecord } from '../../serialization'

import {
  IconRadioGroup,
  IconRadioGroupDefinition,
  type IconRadioGroupConfig,
} from './icon-radio-group'

function serializedDefinition(
  options: readonly { value: string; label: string; icon: string }[],
): SerializedRecord {
  const definition = new IconRadioGroupDefinition({
    options,
  } as IconRadioGroupConfig)
  return definition.accept(new TestSerializationVisitor())
}

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

describe('IconRadioGroup', () => {
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

  describe('deserialize', () => {
    test('accepts legacy `*16` icon ids from older runtimes', () => {
      const def = IconRadioGroupDefinition.deserialize(
        deserializeRecord(
          serializedDefinition([
            { value: 'code', label: 'Code', icon: 'Code16' },
            { value: 'subscript', label: 'Subscript', icon: 'Subscript16' },
            {
              value: 'superscript',
              label: 'Superscript',
              icon: 'Superscript16',
            },
            { value: 'left', label: 'Left', icon: 'TextAlignLeft' },
          ]),
        ),
      )

      expect(def.config.options.map((option) => option.icon as string)).toEqual(
        ['Code16', 'Subscript16', 'Superscript16', 'TextAlignLeft'],
      )
    })

    test('rejects unknown icon ids', () => {
      expect(() =>
        IconRadioGroupDefinition.deserialize(
          deserializeRecord(
            serializedDefinition([
              { value: 'code', label: 'Code', icon: 'NotAnIcon' },
            ]),
          ),
        ),
      ).toThrow()
    })
  })

  describe('assignability', () => {
    function assignTest<C extends IconRadioGroupConfig>(
      _def: IconRadioGroupDefinition<C>,
    ) {}
    assignTest(IconRadioGroup({ options }))
    assignTest(IconRadioGroup({ label: 'Block type', options }))
    assignTest(
      IconRadioGroup({ label: 'Block type', options, defaultValue: 'code' }),
    )
    assignTest(IconRadioGroup({ options, defaultValue: 'code' as string }))
    assignTest(IconRadioGroup({ options, defaultValue: undefined }))
    assignTest(
      IconRadioGroup({ label: 'visible', options, defaultValue: undefined }),
    )
    assignTest(
      IconRadioGroup({ label: undefined, options, defaultValue: undefined }),
    )
  })
})

describe.each([
  [IconRadioGroup({ options }), ['code', 'superscript', undefined] as const],
  [
    IconRadioGroup({ options, defaultValue: 'code' }),
    ['code', 'superscript'] as const,
  ],
])('IconRadioGroup', (def, values) => {
  const invalidValues = [null, 17, 'random', { swatchId: 42 }]
  testDefinition(def, values, invalidValues)
  testResolveValue(def, values)
})

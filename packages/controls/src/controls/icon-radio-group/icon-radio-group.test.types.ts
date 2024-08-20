import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import {
  unstable_IconRadioGroup as IconRadioGroup,
  IconRadioGroupIcon,
} from './icon-radio-group'

describe('unstable_IconRadioGroup Types', () => {
  describe('infers types from control definition', () => {
    test('default value not provided', () => {
      const def = IconRadioGroup({
        label: 'Icons',
        options: [
          { value: 'a', label: 'code', icon: IconRadioGroup.Icon.Code },
          {
            value: 'b',
            label: 'superscript',
            icon: IconRadioGroup.Icon.Superscript,
          },
        ],
      })

      type OptionListItem = {
        readonly label: string
        readonly icon: IconRadioGroupIcon
        readonly value: 'a' | 'b'
      }

      type Config = typeof def.config
      expectTypeOf<Config['options']>().toEqualTypeOf<
        readonly [OptionListItem, ...OptionListItem[]]
      >()
      expectTypeOf<Config['defaultValue']>().toEqualTypeOf<
        'a' | 'b' | undefined
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<'a' | 'b' | undefined>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<'a' | 'b' | undefined>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })

    test('default value provided', () => {
      const def = IconRadioGroup({
        label: 'Icons',
        options: [
          { value: 'a', label: 'code', icon: IconRadioGroup.Icon.Code },
          {
            value: 'b',
            label: 'superscript',
            icon: IconRadioGroup.Icon.Superscript,
          },
        ],
        defaultValue: 'a',
      })

      type OptionListItem = {
        readonly label: string
        readonly icon: IconRadioGroupIcon
        readonly value: 'a' | 'b'
      }

      type Config = typeof def.config
      expectTypeOf<Config['options']>().toEqualTypeOf<
        readonly [OptionListItem, ...OptionListItem[]]
      >()
      expectTypeOf<Config['defaultValue']>().toEqualTypeOf<'a' | 'b'>()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<'a' | 'b'>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<'a' | 'b'>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b'>()
    })
  })
})

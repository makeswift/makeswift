import { Select } from './select'
import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../control-definition'
import { expectTypeOf } from 'expect-type'

describe('Select Types', () => {
  describe('infers types from control definition', () => {
    test('default value not provided', () => {
      const def = Select({
        label: 'Nato',
        options: [
          { value: 'a', label: 'alpha' },
          { value: 'b', label: 'beta' },
        ],
      })

      type OptionListItem = { label: string; value: 'a' | 'b' }

      type Config = typeof def.config
      expectTypeOf<Config['options']>().toEqualTypeOf<
        [OptionListItem, ...OptionListItem[]]
      >()
      expectTypeOf<Config['defaultValue']>().toEqualTypeOf<
        'a' | 'b' | undefined
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()
      expectTypeOf<Config['labelOrientation']>().toEqualTypeOf<
        'horizontal' | 'vertical' | undefined
      >()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<'a' | 'b' | undefined>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<'a' | 'b' | undefined>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })

    test('default provided', () => {
      const def = Select({
        label: 'Nato',
        options: [
          { value: 'a', label: 'alpha' },
          { value: 'b', label: 'beta' },
        ],
        defaultValue: 'a',
      })

      type OptionListItem = { label: string; value: 'a' | 'b' }

      type Config = typeof def.config
      expectTypeOf<Config['options']>().toEqualTypeOf<
        [OptionListItem, ...OptionListItem[]]
      >()
      expectTypeOf<Config['defaultValue']>().toEqualTypeOf<'a'>()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()
      expectTypeOf<Config['labelOrientation']>().toEqualTypeOf<
        'horizontal' | 'vertical' | undefined
      >()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<'a' | 'b'>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<'a' | 'b'>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b'>()
    })
  })
})

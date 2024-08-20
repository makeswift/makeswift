import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { Combobox } from './combobox'

describe('Combobox Types', () => {
  describe('infers types from control definition', () => {
    test('synchronous getOptions', () => {
      const def = Combobox({
        label: 'Nato',
        getOptions: () => [
          { id: 'a', value: 'a', label: 'alpha' },
          { id: 'b', value: 'b', label: 'beta' },
        ],
      })

      type OptionListItem = { label: string; value: 'a' | 'b'; id: string }

      type Config = typeof def.config
      expectTypeOf<Config['getOptions']>().branded.toEqualTypeOf<
        () => OptionListItem[]
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<OptionListItem>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<OptionListItem>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })

    test('synchronous getOptions with query passed', () => {
      const def = Combobox({
        label: 'Nato',
        getOptions: (_query) => [
          { id: 'a', value: 'a', label: 'alpha' },
          { id: 'b', value: 'b', label: 'beta' },
        ],
      })

      type OptionListItem = { label: string; value: 'a' | 'b'; id: string }

      type Config = typeof def.config
      expectTypeOf<Config['getOptions']>().branded.toEqualTypeOf<
        (q: string) => OptionListItem[]
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<OptionListItem>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<OptionListItem>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })

    test('asynchronous getOptions with query passed', () => {
      const def = Combobox({
        label: 'Nato',
        getOptions: async (_query) =>
          Promise.resolve([
            { id: 'a', value: 'a', label: 'alpha' },
            { id: 'b', value: 'b', label: 'beta' },
          ]),
      })

      type OptionListItem = { label: string; value: 'a' | 'b'; id: string }

      type Config = typeof def.config
      expectTypeOf<Config['getOptions']>().branded.toEqualTypeOf<
        (q: string) => Promise<OptionListItem[]>
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<OptionListItem>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<OptionListItem>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })

    test('asynchronous getOptions', () => {
      const def = Combobox({
        label: 'Nato',
        getOptions: async () =>
          Promise.resolve([
            { id: 'a', value: 'a', label: 'alpha' },
            { id: 'b', value: 'b', label: 'beta' },
          ]),
      })

      type OptionListItem = { label: string; value: 'a' | 'b'; id: string }

      type Config = typeof def.config
      expectTypeOf<Config['getOptions']>().branded.toEqualTypeOf<
        () => Promise<OptionListItem[]>
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<OptionListItem>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<OptionListItem>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })
  })
})

import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { Slot, type RenderedNode } from './testing'

describe('Slot Types', () => {
  test('infers types from control definition', () => {
    const def = Slot()

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{ columnCount?: number }>()

    type Data = Exclude<DataType<typeof def>, undefined>
    type Value = Exclude<ValueType<typeof def>, undefined>
    expectTypeOf<Data>().toEqualTypeOf<Value>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<RenderedNode>()
  })
})

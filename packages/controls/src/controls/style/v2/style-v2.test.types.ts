import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../../associated-types'
import { Checkbox, CheckboxDefinition } from '../../checkbox'

import { StylesObject, StyleV2 } from './testing'

describe('StyleV2 Types', () => {
  test('infers types from control definition', () => {
    const def = StyleV2({
      type: Checkbox({ defaultValue: true }),
      getStyle(visibility) {
        return { visibility: visibility ? 'visible' : 'hidden' }
      },
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      type: CheckboxDefinition<{
        defaultValue: boolean
        label?: string | undefined
      }>
      getStyle: (item: boolean | undefined) => StylesObject
    }>()

    type Data = DataType<typeof def>

    expectTypeOf<Data>().toEqualTypeOf<
      {
        value:
          | boolean
          | {
              value: boolean
              '@@makeswift/type': 'checkbox::v1'
            }
        deviceId: string
      }[]
    >()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<
      {
        value: boolean
        deviceId: string
      }[]
    >()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<string>()
  })
})

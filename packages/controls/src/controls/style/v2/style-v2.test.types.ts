import { expectTypeOf } from 'expect-type'

import { Flatten } from '../../../testing/util-types'

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
    // The nested checkbox config is an intersection (`z.infer<...> &
    // ProvidesConfig<P>`), which `toEqualTypeOf` does not consider equal to
    // the identical flat object type, so assert its members separately.
    expectTypeOf<Config['type']>().toMatchTypeOf<CheckboxDefinition>()
    expectTypeOf<Flatten<Config['type']['config']>>().toEqualTypeOf<{
      defaultValue: boolean
      description?: string
      label?: string
      provides?: undefined
    }>()
    expectTypeOf<Config['getStyle']>().toEqualTypeOf<
      (item: boolean | undefined) => StylesObject
    >()

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

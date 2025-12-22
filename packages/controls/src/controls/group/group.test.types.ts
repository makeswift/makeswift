import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'
import { Color } from '../color'
import { List } from '../list'
import { Number } from '../number'

import { Group, GroupDefinition } from './group'

type ExpectedPropsDataType = {
  color: {
    swatchId: string
    alpha: number
    [ControlDataTypeKey]?: 'color::v1'
  }
  list: {
    id: string
    type?: string
    value?:
      | number
      | {
          [ControlDataTypeKey]: 'number::v1'
          value: number
        }
  }[]
}

describe('Group Types', () => {
  describe('infers types from control function', () => {
    test('Group {Color, List<Number>}', () => {
      const colorDef = Color()
      const numberListDef = List({ type: Number({ defaultValue: 0 }) })

      const colorFn = () => colorDef
      const listFn = () => numberListDef

      const def = Group({
        label: 'Group',
        preferredLayout: Group.Layout.Popover,
        props: {
          color: Color(),
          list: List({
            type: Number({ defaultValue: 0 }),
          }),
        },
      })

      type Config = typeof def.config

      // Something about using expectTypeOf on the entire config causes a strange typescript error.
      // The type of `label` changes when `type` is included.
      // We are individually testing different overlapping subsets to work around this.
      type ConfigWithoutType = Omit<Config, 'props'>
      expectTypeOf<ConfigWithoutType>().toEqualTypeOf<{
        readonly label?: string
        readonly description?: string
        readonly preferredLayout?:
          | typeof Group.Layout.Popover
          | typeof Group.Layout.Inline
      }>()

      type ConfigWithoutLabel = Omit<Config, 'label'>
      expectTypeOf<ConfigWithoutLabel>().toEqualTypeOf<{
        readonly description?: string
        readonly preferredLayout?:
          | typeof Group.Layout.Popover
          | typeof Group.Layout.Inline
        readonly props: {
          color: ReturnType<typeof colorFn>
          list: ReturnType<typeof listFn>
        }
      }>()

      type Data = DataType<typeof def>

      expectTypeOf<Data>().toEqualTypeOf<
        | {
            [ControlDataTypeKey]: 'group::v1' | 'shape-v2::v1'
            value: ExpectedPropsDataType
          }
        | ExpectedPropsDataType
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<{
        color: { swatchId: string; alpha: number }
        list: number[]
      }>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{
        color: string | undefined
        list: number[]
      }>()
    })
  })

  test('infers types from control definition', () => {
    type def = GroupDefinition

    type Data = DataType<def>
    expectTypeOf<Data>().toEqualTypeOf<
      | {
          [ControlDataTypeKey]: 'group::v1' | 'shape-v2::v1'
          value: { [key: string]: any }
        }
      | { [key: string]: any }
    >()

    type Value = ValueType<def>
    expectTypeOf<Value>().toEqualTypeOf<{ [key: string]: any }>()

    type Resolved = ResolvedValueType<def>
    expectTypeOf<Resolved>().toEqualTypeOf<{ [key: string]: any }>()
  })
})

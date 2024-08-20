import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../../associated-types'

import * as Slate from '../slate'
import { type RichTextValue } from '../v1'

import { RenderedNode, RichText } from './testing'

describe('RichText Types', () => {
  test('infers types from control definitions', () => {
    const def = RichText()

    type Data = DataType<typeof def>

    expectTypeOf<Data>().toEqualTypeOf<
      | {
          type: 'makeswift::controls::rich-text-v2'
          version: 2
          descendants: Slate.Descendant[]
          key: string
        }
      | RichTextValue
    >()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<{
      type: 'makeswift::controls::rich-text-v2'
      version: 2
      descendants: Slate.Descendant[]
      key: string
    }>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<RenderedNode>()
  })
})

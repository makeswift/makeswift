import { RichText } from './testing'
import { type DataType } from '../../control-definition'

import * as Slate from '../slate'

import { expectTypeOf } from 'expect-type'
import { type RichTextValue } from '../v1'

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
  })
})

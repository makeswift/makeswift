import { expectTypeOf } from 'expect-type'
import { Link, LinkControlData } from './link'
import { DataType, ResolvedValueType, ValueType } from '../control-definition'

describe('Link Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = Link()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<LinkControlData>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<LinkControlData>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{
        href: string
        target: '_blank' | '_self' | undefined
        onClick: (args: MouseEvent, ...argsRest: unknown[]) => void
      }>
    })
  })
})

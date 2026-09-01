import { expectTypeOf } from 'expect-type'

import { unstable_ContextValue } from '../context-value'

import { Slider } from './slider'

describe('Slider Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = Slider()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        description?: string
        defaultValue?: number
        min?: number
        max?: number
        step?: number
        showInput?: boolean
        provides?: undefined
      }>()
    })

    test('context provided', () => {
      const volumeContext = unstable_ContextValue('volume').ofType<number>()
      const def = Slider({ defaultValue: 50, provides: volumeContext })

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        description?: string
        defaultValue: number
        min?: number
        max?: number
        step?: number
        showInput?: boolean
        provides?: typeof volumeContext
      }>()
    })
  })
})

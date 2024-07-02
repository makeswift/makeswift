import { Shape } from './shape'
import { Color } from '../color'
import { Checkbox } from '../checkbox'

describe('Shape', () => {
  describe('constructor', () => {
    test('heterogenous controls', () => {
      const shape = Shape({
        type: {
          val: Color({ defaultValue: 'red' }),
          num: Checkbox(),
        },
      })
      expect(shape).toMatchSnapshot()
    })
  })
})

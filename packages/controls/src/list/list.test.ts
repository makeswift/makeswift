import { List } from './list'
import { Color } from '../color'
// import {
//   type ValueType,
//   type ResolvedValueType,
//   DataType,
// } from '../control-definition'

describe('List', () => {
  describe('constructor', () => {
    test('list of colors', () => {
      const list = List({
        type: Color({ defaultValue: 'red', labelOrientation: 'horizontal' }),
        label: 'Color list',
      })
      expect(list).toMatchSnapshot()
      //   type D = DataType<typeof list>
      //   type V = ValueType<typeof list>
      //   type R = ResolvedValueType<typeof list>
      //   const r: R = [['#ff0000', undefined], ['#00ff00']]
      // colorList: List({ label: 'Color list', type: Color({ defaultValue: 'blue' }) }),
    })
  })
})

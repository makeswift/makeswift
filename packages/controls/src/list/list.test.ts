import { List } from './list'
import { Color } from '../color'
import { Checkbox } from '../checkbox'
// import { Number } from '../number'
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

    test('list of checkboxes', () => {
      const list = List({
        type: Checkbox({ defaultValue: true }),
        label: 'Checkbox list',
        getItemLabel: (value: boolean): string => (value ? 'true' : 'false'),
      })

      expect(list).toMatchSnapshot()
    })

    // test('list of numbers', () => {
    //   const numberList = List({ label: 'Number list', type: Number() })
    // })
  })
})

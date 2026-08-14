import { getProp } from '../prop-by-path'

const record = {
  a: 'apple',
  b: {
    c: 'carrot',
    d: [{ e: 'eggplant' }, { e: 'elderberry' }, { f: 'fennel' }],
    g: {
      i: 'izote',
      100: 'horseradish',
    },
  },
  j: ['jackfruit', 'jalapeno', 'jicama'],
}

describe('getProp', () => {
  test.each([
    ['a', 'apple'],
    ['b.c', 'carrot'],
    ['b.d.e', undefined],
    ['b.d.0.e', 'eggplant'],
    ['b.d.1.e', 'elderberry'],
    ['b.d.1.f', undefined],
    ['b.d.2.f', 'fennel'],
    ['b.d.3.f', undefined],
    ['b.g.i', 'izote'],
    ['b.g.100', 'horseradish'],
    ['b.g.10', undefined],
    ['j', ['jackfruit', 'jalapeno', 'jicama']],
    ['j.0', 'jackfruit'],
    ['j.1', 'jalapeno'],
    ['j.2', 'jicama'],
    ['j.17', undefined],
    ['j.k', undefined],
    ['35', undefined],
  ])('prop path "%s" returns %s', (propPath, expected) => {
    expect(getProp(record, propPath)).toStrictEqual(expected)
  })
})

import { deepEqual } from '../deepEqual'
import { shallowEqual } from '../shallowEqual'

const scalars = [
  undefined,
  null,
  true,
  false,
  0,
  -0,
  NaN,
  Infinity,
  -Infinity,
  17,
  '',
  'hello',
]

const scalarsObj = scalars.reduce(
  (obj, s) => ({ [`${String(s)}`]: s, ...obj }),
  {},
)

const equalityOp = {
  shallowEqual: shallowEqual,
  deepEqual: deepEqual,
} as const

describe.each(['shallowEqual', 'deepEqual'] as const)(
  '%s returns true for identical values',
  (op) => {
    test.each(scalars)('%s', (a) => {
      expect(equalityOp[op](a, a)).toBe(true)
    })
  },
)

describe.each(['shallowEqual', 'deepEqual'] as const)(
  '%s returns false',
  (op) => {
    test.each([
      [undefined, null],
      [null, false],
      [null, 0],
      [false, 0],
      [false, true],
      [0, -0],
      [NaN, Infinity],
      [Infinity, -Infinity],
      [[], {}],
      [[17], { '0': 17 }],
      [{ a: [17] }, { a: { '0': 17 } }],
      [[null, undefined], { '0': null, '1': undefined }],
    ])('%s vs %s', (a, b) => {
      expect(equalityOp[op](a, b)).toBe(false)
    })
  },
)

describe.each(['shallowEqual', 'deepEqual'] as const)(
  '%s object comparison',
  (op) => {
    const isDeep = op === 'deepEqual'
    test.each([
      [{}, {}, true],
      [{ a: 1 }, { a: 1 }, true],
      [{ a: 'hello' }, { a: 'hello' }, true],
      [{ a: 'hello' }, { a: 'hello', b: undefined }, false],
      [{ a: 1 }, { a: '1' }, false],
      [{ a: 1 }, { a: 2 }, false],
      [{ a: 1, b: 2 }, { a: 1 }, false],
      [{ a: 1, b: 'hello' }, { b: 'hello', a: 1 }, true],
      [{ a: 1 }, { b: 1 }, false],
      [{ a: 0 }, { a: -0 }, false],
      [{ a: NaN }, { a: NaN }, true],
      [{ a: [] }, { a: [] }, isDeep],
      [{ a: {} }, { a: {} }, isDeep],
      [{ a: scalars }, { a: scalars }, true],
      [{ a: scalars }, { a: [...scalars] }, isDeep],
      [scalarsObj, { ...scalarsObj }, true],
      [{ a: scalarsObj }, { a: scalarsObj }, true],
      [{ a: scalarsObj }, { a: { ...scalarsObj } }, isDeep],
      [{ a: [{ b: 1 }] }, { a: [{ b: 1 }] }, isDeep],
    ])('%o vs %o => %s', (a, b, expected) => {
      expect(equalityOp[op](a, b)).toBe(expected)
    })

    test('non-enumerable props are ignored', () => {
      const a = {}
      const b = {}

      Object.defineProperty(a, 'hidden', {
        enumerable: false,
        value: 17,
      })

      Object.defineProperty(b, 'hidden', {
        enumerable: false,
        value: 'hello',
      })

      expect(equalityOp[op](a, b)).toBe(true)
    })
  },
)

describe.each(['shallowEqual', 'deepEqual'] as const)(
  '%s array comparisons',
  (op) => {
    const isDeep = op === 'deepEqual'
    test.each([
      [[], [], true],
      [scalars, [...scalars], true],
      [scalars, [...scalars, undefined], false],
      [[1, 2], [1], false],
      [[1, 2], [2, 1], false],
      [[1, 2], [1, 3], false],
      [[0], [-0], false],
      [[NaN], [NaN], true],
      [[scalarsObj], [scalarsObj], true],
      [[scalarsObj], [{ ...scalarsObj }], isDeep],
      [
        [{ a: [{ b: 1 }] }, { c: [...scalars] }],
        [{ a: [{ b: 1 }] }, { c: [...scalars] }],
        isDeep,
      ],
      [Array.from<string>({ length: 3 }), [], false],
      [
        Array.from<string>({ length: 3 }),
        Array.from<string>({ length: 3 }),
        true,
      ],
      [
        Array.from<string>({ length: 3 }),
        [undefined, undefined, undefined],
        true,
      ],
    ])('%o vs %o => %s', (a, b, expected) => {
      expect(equalityOp[op](a, b)).toBe(expected)
    })

    test('non-enumerable props are ignored', () => {
      const a = [17, 0, -5]
      const b = [17, 0, -5]

      Object.defineProperty(a, 'hidden', {
        enumerable: false,
        value: 17,
      })

      Object.defineProperty(b, 'hidden', {
        enumerable: false,
        value: 'hello',
      })

      expect(equalityOp[op](a, b)).toBe(true)
    })
  },
)

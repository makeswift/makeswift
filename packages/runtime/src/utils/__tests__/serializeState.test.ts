import { expectTypeOf } from 'expect-type'
import { serializeState } from '../serializeState'

describe('serializeState', () => {
  test.each([17, 'text', ['hello', 42.05, 'world']])('correctly serializes %s to itself', state => {
    expect(serializeState(state)).toStrictEqual(state)
  })

  test.each([
    new Map<string, any>([
      ['text', 'hi'],
      ['number', 24.99],
      ['array', ['hello', 17]],
      [
        'record',
        {
          big: 'fish',
          small: 'pond',
          nestedArray: [3, 5, 7, 9],
          nestedMap: new Map([['key', 'value']]),
          nestedSet: new Set([1, 2, 3]),
        },
      ],
      ['set', new Set([3, 5, 7])],
      ['map', new Map([['price', 9.99]])],
    ]),
  ])('correctly serializes %s', state => {
    expect(serializeState(state)).toMatchSnapshot()
  })

  test('correctly infers the result type', () => {
    expectTypeOf(serializeState(new Set([3, 5, 7]))).toEqualTypeOf<number[]>()

    expectTypeOf(serializeState(new Map([['text', 'hi']]))).toEqualTypeOf<Record<string, string>>()
    expectTypeOf(serializeState(new Map([['nested', new Map([['number', 17]])]]))).toEqualTypeOf<
      Record<string, Record<string, number>>
    >()

    expectTypeOf(
      serializeState({ record: new Map([['nested', new Map([['number', 17]])]]) }),
    ).toEqualTypeOf<Record<string, Record<string, Record<string, number>>>>()

    expectTypeOf(
      serializeState({ record: new Map([['nested', new Set([3, 5, 7])]]) }),
    ).toEqualTypeOf<Record<string, Record<string, number[]>>>()
  })
})
